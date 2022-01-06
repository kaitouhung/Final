# Informatiton about final project

## 1. PORT

- Client: 3000
- Auth: 8080
- Query: 3004
- Post: 3001
- Crawl: 8000
- Comment: 8081
- Socket: 8900
- Topic: 3003

## 2. Kafka Topic

- auth-signup: send pub to Query Service about create user
- service-authen: send token to Auth Service to check
- auth-authen: send information after check token to Service requires
- crawl-news: send pub to Post to save data crawl
- create-post: send pub to Query Service about create post
- seed-admin-account:
- update-user-status:
