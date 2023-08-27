# worker-coordindator-react-node

A simple application that allows admins to recieve messages from their workers which are displayed on a dashboard.

After signing up, the admin can add workers and other admins.  Those workers then can log in and will have a screen where they can sent messages.  These messages are then displayed on the admin's home page so they can see the messages.

# Running

## Setting up and running locally

0. This project uses postgresql, node, and react so if you don't have these installed you will need to install them and set them up.
1. Create a database using `createdb yourdatabasename`
2. Copy `.env.example` in the `backend/prisma` directory to `.env` and update the database credentials and the secret keys
3. Run `npm run init-db` to setup the initial database
4. Run `npm run app` to run the app and after building and running you should see the message `Worker coordinator listening on port 4000`.  If you see this you can then go to `localhost:4000` to see the app

## Usage

1. Click the `Sign Up` button on the top right to sign up.  After doing so you will be logged in.
2. In the top left you will see an `Add Worker` button which you use to add your workers.
3. After adding your workers they can sign in and add their messages
4. When your workers add messages you will see them in your home page.
