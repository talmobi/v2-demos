# rust-http-microservice

A simple Rust microservice

Optimized image that combines:

- `clux/muslrust` for building a static binary that bundles `musl`
- `hyper` for a small and safe HTTP library on top of `tokio` async I/O

for the highest build-time performance, smallest resulting artifact size
and fastest bootup time.
