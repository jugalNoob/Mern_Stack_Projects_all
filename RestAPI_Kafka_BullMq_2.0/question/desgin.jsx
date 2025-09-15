                           ┌──────────────────────────────┐
                           │        Client (React)        │
                           │   http://localhost:3000      │
                           └──────────────┬───────────────┘
                                          │
                                 HTTP Requests (REST)
                                          │
                           ┌──────────────▼───────────────┐
                           │        Express API           │
                           │   (Clustered Workers)        │
                           │  app.js + Routes + CORS      │
                           └──────────────┬───────────────┘
                                          │
                 ┌────────────────────────┼──────────────────────────┐
                 │                        │                          │
                 │                        │                          │
         ┌─────────────┐          ┌───────────────┐          ┌─────────────────┐
         │   MongoDB   │          │    Kafka      │          │      Redis       │
         │   Atlas DB  │          │  (3 Topics)   │          │  Cache + RateLim │
         │(Collection) │          │               │          │  Pub/Sub + Bull  │
         └──────┬──────┘          └───────┬───────┘          └─────────┬───────┘
                │                         │                            │
                │                         │                            │
       ┌────────▼────────┐       ┌────────▼───────────┐        ┌───────▼────────┐
       │   Mongoose      │       │ Kafka Producers    │        │ BullMQ Queue   │
       │  (Schema+Model) │──────▶│ sendMessage()      │        │ NotificationQ  │
       └─────────────────┘       └────────┬───────────┘        └───────┬────────┘
                                          │                            │
                                 ┌────────▼────────┐          ┌────────▼─────────┐
                                 │ Kafka Consumers │          │ BullMQ Workers   │
                                 │  (SignUp/Get)   │─────────▶│ registerWorker.js │
                                 └─────────────────┘          │  Save to MongoDB  │
                                                               └──────────────────┘





                                                               Client (React)        Express API         Kafka Broker       Kafka Consumer       BullMQ Queue       Worker         MongoDB
     |                     |                   |                   |                   |               |              |
     |--- POST /signup --->|                   |                   |                   |               |              |
     |                     |--- produce -----> |                   |                   |               |              |
     |                     |                   |--- store msg ---->|                   |               |              |
     |                     |                   |                   |--- push job ----->|               |              |
     |                     |                   |                   |                   |--- pull job -->|              |
     |                     |                   |                   |                   |               |--- save ---> |
     |                     |                   |                   |                   |               |              |
     |<-- success response-|                   |                   |                   |               |              |
