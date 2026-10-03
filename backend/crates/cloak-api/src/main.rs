use axum::{extract::{Path, State}, http::StatusCode, routing::{get, post}, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{collections::HashMap, net::SocketAddr, sync::{Arc, Mutex}};
use tower_http::cors::CorsLayer;

#[derive(Clone, Default)]
struct AppState { identities: Arc<Mutex<HashMap<String, Identity>>>, disclosures: Arc<Mutex<HashMap<String, Vec<Value>>>> }

#[derive(Clone, Serialize, Deserialize)]
struct Identity { id: String, display_name: String, npub: String, public_key: String }

#[derive(Deserialize)]
struct Disclosure { subject: String, recipient: String, #[serde(flatten)] payload: Value }

async fn health() -> &'static str { "ok" }

async fn register_identity(State(state): State<AppState>, Json(identity): Json<Identity>) -> (StatusCode, Json<Identity>) {
    state.identities.lock().unwrap().insert(identity.id.clone(), identity.clone());
    (StatusCode::CREATED, Json(identity))
}

async fn get_identity(State(state): State<AppState>, Path(id): Path<String>) -> Result<Json<Identity>, StatusCode> {
    state.identities.lock().unwrap().get(&id).cloned().map(Json).ok_or(StatusCode::NOT_FOUND)
}

async fn publish_disclosure(State(state): State<AppState>, Json(disclosure): Json<Disclosure>) -> StatusCode {
    let mut payload = disclosure.payload;
    if let Value::Object(ref mut object) = payload {
        object.insert("subject".into(), Value::String(disclosure.subject.clone()));
        object.insert("recipient".into(), Value::String(disclosure.recipient.clone()));
    }
    state.disclosures.lock().unwrap().entry(disclosure.recipient).or_default().push(payload);
    StatusCode::CREATED
}

async fn list_disclosures(State(state): State<AppState>, Path(recipient): Path<String>) -> Json<Vec<Value>> {
    Json(state.disclosures.lock().unwrap().get(&recipient).cloned().unwrap_or_default())
}

#[tokio::main]
async fn main() {
    let state = AppState::default();
    let app = Router::new()
        .route("/health", get(health))
        .route("/v1/identities", post(register_identity))
        .route("/v1/identities/{id}", get(get_identity))
        .route("/v1/disclosures", post(publish_disclosure))
        .route("/v1/disclosures/{recipient}", get(list_disclosures))
        .layer(CorsLayer::permissive())
        .with_state(state);
    let address: SocketAddr = std::env::var("CLOAK_API_ADDR").unwrap_or_else(|_| "0.0.0.0:8787".into()).parse().expect("valid CLOAK_API_ADDR");
    println!("Cloak local API listening on http://{address}");
    let listener = tokio::net::TcpListener::bind(address).await.expect("bind Cloak API");
    axum::serve(listener, app).await.expect("serve Cloak API");
}
