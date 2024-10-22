- Clone the repo

```jsx
git clone https://github.com/100xdevs-cohort-2/week-17-final-code
```

- npm install
- Run postgres either locally or on the cloud (neon.tech)

```jsx
docker run  -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

- Copy over all .env.example files to .env
- Update .env files everywhere with the right db url
- Go to `packages/db`
    - npx prisma migrate dev
    - npx prisma db seed
- Go to `apps/user-app` , run `npm run dev`
- Try logging in using phone - 1111111111 , password - alice (See `seed.ts`)

-We have simulated the bank web-hook via hitting the webhook server with an api call via postman
- we didnt use an actual banking api we created one of our own .

# what happens>
- there is a bank we send the bank api all the details like the amount the user id everything ...
- we create a webhook and give the bank folks our webhook and make sure that whenver the payment to the bank was processed then the web-hook should know so that it can update the balance in the frontend for the client
