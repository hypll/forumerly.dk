module.exports = {
    app: [
        {
            name: "Forumerly",
            domain: "www.forumerly.dk",
            description:
                "Forumerly er et forum til at dele viden og ideer & meget mere!",
        },

        {
            main: "index.js",
            scripts: {
                start: "node index.js",
                dev: "nodemon index.js",
            },

            frameworks: {
                express: {
                    version: "4.17.2",
                    port: 3000,
                    up: "💻 Server is running on port",
                },

                bootstrap: {
                    version: "5.2.0",
                },
            },

            database: {
                uri: process.env.MONGO_URI,
            },
        },
    ],
};
