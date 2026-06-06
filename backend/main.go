package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"sync/atomic"
)

var viewCount atomic.Int64

var sqlSnippets = []map[string]interface{}{
	{"lines": []map[string]string{
		{"t": "WITH sessions AS (", "c": "kw"},
		{"t": "  SELECT user_id,", "c": "id"},
		{"t": "    MIN(ts) AS start,", "c": "fn"},
		{"t": "    MAX(ts) AS end_ts", "c": "fn"},
		{"t": "  FROM events", "c": "kw"},
		{"t": "  GROUP BY 1, 2", "c": "kw"},
		{"t": ")", "c": "id"},
	}},
	{"lines": []map[string]string{
		{"t": "SELECT", "c": "kw"},
		{"t": "  ROW_NUMBER() OVER (", "c": "fn"},
		{"t": "    PARTITION BY cohort", "c": "kw"},
		{"t": "    ORDER BY revenue DESC", "c": "kw"},
		{"t": "  ) AS rank", "c": "id"},
		{"t": "FROM analytics.orders", "c": "id"},
	}},
	{"lines": []map[string]string{
		{"t": "SELECT", "c": "kw"},
		{"t": "  SUM(o.amount) AS ltv", "c": "fn"},
		{"t": "FROM dim_users u", "c": "kw"},
		{"t": "INNER JOIN fact_orders o", "c": "kw"},
		{"t": "  ON u.id = o.user_id", "c": "id"},
		{"t": "WHERE u.is_active = TRUE", "c": "str"},
		{"t": "GROUP BY 1, 2", "c": "kw"},
	}},
	{"lines": []map[string]string{
		{"t": "-- dbt model", "c": "comment"},
		{"t": "-- {{ ref('users') }}", "c": "comment"},
		{"t": "SELECT user_id, email", "c": "kw"},
		{"t": "  ,COALESCE(name,", "c": "fn"},
		{"t": "    'Unknown') AS name", "c": "str"},
		{"t": "FROM {{ source(", "c": "fn"},
		{"t": "  'raw', 'users') }}", "c": "str"},
	}},
	{"lines": []map[string]string{
		{"t": "SELECT", "c": "kw"},
		{"t": "  LAG(revenue, 1)", "c": "fn"},
		{"t": "  OVER (ORDER BY week)", "c": "kw"},
		{"t": "  AS prev_revenue,", "c": "id"},
		{"t": "  ROUND(revenue /", "c": "fn"},
		{"t": "    NULLIF(prev, 0)-1, 2)", "c": "fn"},
		{"t": "  AS wow_growth", "c": "id"},
	}},
	{"lines": []map[string]string{
		{"t": "CREATE OR REPLACE VIEW", "c": "kw"},
		{"t": "  metrics.daily_kpi AS", "c": "id"},
		{"t": "SELECT dt,", "c": "kw"},
		{"t": "  SUM(revenue) AS rev,", "c": "fn"},
		{"t": "  COUNT(DISTINCT uid) AS dau", "c": "fn"},
		{"t": "FROM fact_events", "c": "kw"},
		{"t": "GROUP BY dt ORDER BY dt DESC", "c": "kw"},
	}},
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func handleViews(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	count := viewCount.Add(1)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int64{"views": count})
}

func handleQuery(w http.ResponseWriter, r *http.Request) {
	snippet := sqlSnippets[rand.Intn(len(sqlSnippets))]
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(snippet)
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/views", handleViews)
	mux.HandleFunc("/api/query", handleQuery)

	// Serve built React app from ./static
	fs := http.FileServer(http.Dir("./static"))
	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// SPA fallback: serve index.html for unknown routes
		http.ServeFile(w, r, "./static/index.html")
	}))
	mux.Handle("/assets/", fs)

	handler := corsMiddleware(mux)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
