use std::sync::atomic::{AtomicUsize, Ordering};

use futures::{FutureExt, StreamExt, stream};
use warp::Filter;
use warp::ws::{Message, WebSocket};
//use futures::executor::block_on;

static COUNT: AtomicUsize = AtomicUsize::new(1);


async fn handle_client(websocket: WebSocket) {
    // increment the count
    let count = COUNT.fetch_add(1, Ordering::Relaxed);
    println!("{}", count);
    // Just echo all messages back...
    let (tx, _rx) = websocket.split();

    let repeater = stream::repeat_with(|| {
        Ok(Message::text(format!("{:?}", COUNT)))
    });

    repeater.forward(tx).map(|result| {
        if let Err(e) = result {
            // TODO: handle connection closing properly
            if format!("{:?}", e) == "ConnectionClosed".to_string() {
                let count = COUNT.fetch_sub(1, Ordering::Relaxed);
                println!("{}", count);
                return;
            }
            println!("websocket error: {:?}", e);
        }
    }).await;
}

#[tokio::main]
async fn main() {
    let routes = warp::path("echo")
        // The `ws()` filter will prepare the Websocket handshake.
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| {
            // And then our closure will be called when it completes...
            ws.on_upgrade(move |websocket| handle_client(websocket))
        });

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}
