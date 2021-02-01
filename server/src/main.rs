use std::sync::atomic::{AtomicUsize, Ordering};

use futures::{SinkExt, StreamExt};
use tokio::time;
use warp::ws::{Message, WebSocket};
use warp::Filter;

static COUNT: AtomicUsize = AtomicUsize::new(0);

async fn handle_client(websocket: WebSocket) {
    let count = COUNT.fetch_add(1, Ordering::Relaxed);
    println!("count: {} - connect", count);

    let (mut tx, _rx) = websocket.split();

    async {
        let mut interval = time::interval(time::Duration::from_secs(1));
        loop {
            let result = tx.send(Message::text(format!("{:?}", COUNT))).await;
            if let Err(e) = result {
                let count = COUNT.fetch_sub(1, Ordering::Relaxed);
                println!("count: {} - disconnect - {:?}", count, e);
                break;
            }
            interval.tick().await;
        }
    }
    .await;
}

#[tokio::main]
async fn main() {
    let routes = warp::path("echo")
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| ws.on_upgrade(move |websocket| handle_client(websocket)));

    warp::serve(routes).run(([0, 0, 0, 0], 3030)).await;
}
