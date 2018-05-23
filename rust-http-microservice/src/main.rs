extern crate hyper;
extern crate futures;

use futures::future::Future;
use hyper::header::ContentLength;
use hyper::server::{Http, Request, Response, Service};

struct HelloWorld;
const HELLO_WORLD: &'static str = "Hello, World!";

impl Service for HelloWorld {
    type Request = Request;
    type Response = Response;
    type Error = hyper::Error;
    type Future = Box<Future<Item=Self::Response, Error=Self::Error>>;

    fn call(&self, _req: Request) -> Self::Future {
        Box::new(futures::future::ok(
            Response::new()
                .with_header(ContentLength(HELLO_WORLD.len() as u64))
                .with_body(HELLO_WORLD)
        ))
    }
}

fn main() {
    let addr = "0.0.0.0:3000".parse().unwrap();
    let server = Http::new().bind(&addr, || Ok(HelloWorld)).unwrap();
    server.run().unwrap();
}
