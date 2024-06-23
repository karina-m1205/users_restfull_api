const express = require("express");
const app = express();

const body_parser = require("body-parser");
app.use(body_parser.json());

const fs = require("fs");

// task 1.1
app.get("/users", (req, res) => {
    try {
        const all_users = fs.readFileSync("users.json");
        const users = JSON.parse(all_users);
        res.send(users);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.get('/users/:position', (req, res) => {    
    try {
        const all_users = fs.readFileSync("users.json");
        const users = JSON.parse(all_users);
        const user = users.find(user => users.indexOf(user) === parseInt(req.params.position));
        if (user) {
            res.send(user);
        } else {
            return res.status(404).send("user not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.post("/users", (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).send("doesn't exist");
    }

    let single_user_data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    try {
        const user_data = fs.readFileSync("users.json");
        const users = JSON.parse(user_data);

        if (!users.find(user => user.email === single_user_data.email)) {
            users.push(single_user_data);
        } else {
            return res.status(400).send("user already exists"); // поискать статус-код для этого случая
        }
        fs.writeFileSync("users.json", JSON.stringify(users));
        res.send(single_user_data);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.put("/users/:position", (req, res) => {
    try {
        const all_users = fs.readFileSync("users.json");
        const users = JSON.parse(all_users);
        let user = users.find(user => users.indexOf(user) === parseInt(req.params.position));

        if (user) {
            const { name, email, password } = { ...req.body };
            user.name = name;
            user.email = email;
            user.password = password;

            fs.writeFileSync("users.json", JSON.stringify(users));
            res.send(user);
        } else {
            return res.status(404).send("user not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.delete("/users/:position", (req, res) => {
    try {
        const all_users = fs.readFileSync("users.json");
        let users = JSON.parse(all_users);
        let user = users.find(user => users.indexOf(user) === parseInt(req.params.position));

        if (user) {
            users.splice(users.indexOf(user), 1);
            fs.writeFileSync("users.json", JSON.stringify(users));
            res.send("user has been deleted");
        } else {
            return res.status(404).send("user not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong");
    }
});
//
//task 1.2
app.post("/users/:position/profile", (req, res) => {
    try {
        const user_data = fs.readFileSync("users.json");
        const users = JSON.parse(user_data);

        const user_profile_data = {
            bio: req.body.bio,
            picture: req.body.picture_url
        }

        const user = users.find(user => users.indexOf(user) === parseInt(req.params.position));
        if (user) {
            user.profile = user_profile_data;
            fs.writeFileSync("users.json", JSON.stringify(users));
            res.send(user.profile);
        } else {
            return res.status(400).send("user not found"); // поискать статус-код для этого случая
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.get('/users/:position/profile', (req, res) => {
    try {
        const all_users = fs.readFileSync("users.json");
        const users = JSON.parse(all_users);
        const user = users.find(user => users.indexOf(user) === parseInt(req.params.position));
        if (user) {
            if ("profile" in user) {
                res.send(user.profile);
            } else {
                return res.status(404).send("user's profile not found");
            }
        } else {
            return res.status(404).send("user not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.put("/users/:position/profile", (req, res) => {
    try {
        const all_users = fs.readFileSync("users.json");
        const users = JSON.parse(all_users);
        let user = users.find(user => users.indexOf(user) === parseInt(req.params.position));

        if (user) {
            const { bio, picture_url } = { ...req.body };
            user.profile.bio = bio;
            user.profile.picture = picture_url;

            fs.writeFileSync("users.json", JSON.stringify(users));
            res.send(user.profile);
        } else {
            return res.status(404).send("user not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.delete("/users/:position/profile", (req, res) => {
    try {
        const all_users = fs.readFileSync("users.json");
        let users = JSON.parse(all_users);
        let user = users.find(user => users.indexOf(user) === parseInt(req.params.position));

        if (user) {
            delete user.profile;
            fs.writeFileSync("users.json", JSON.stringify(users));
            res.send("user profile has been deleted");
        } else {
            return res.status(404).send("user not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong");
    }
});
//
// task 1.3
app.put("/users/:position/profile/picture", (req, res) => {
    try {
        const all_users = fs.readFileSync("users.json");
        const users = JSON.parse(all_users);
        let user = users.find(user => users.indexOf(user) === parseInt(req.params.position));

        if (user) {
            const {picture_url} = { ...req.body };            
            user.profile.picture = picture_url;

            fs.writeFileSync("users.json", JSON.stringify(users));
            res.send(user.profile);
        } else {
            return res.status(404).send("user not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.listen(3000);