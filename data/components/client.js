const Client = require("instagram-private-api").V1;
const device = new Client.Device("myDevice");
const storage = new Client.CookieFileStorage("./cookies.json");
async function client() {
    // Login to the Instagram account
    const session = await Client.Session.create(device, storage, "username", "password");

    // Search for the target account
    const account = await Client.Account.searchForUser(session, "targetUsername");

    // Get the media feed for the account
    const mediaFeed = new Client.Feed.UserMedia(session, account.id);

    // Retrieve the latest 5 posts from the media feed
    const posts = await mediaFeed.get();
    const fiveLatestPosts = posts.slice(0, 5);

    // Log the post parameters and image URL for each post
    fiveLatestPosts.forEach(post => {
        console.log("Post parameters:", post.params);
        console.log("Image URL:", post.images.standard_resolution.url);
    })
}

