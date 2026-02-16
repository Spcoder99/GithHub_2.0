const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const { ENV } = require("../config/env");
const { ObjectId } = require("mongodb");
const { S3_BUCKET, s3 } = require("../config/aws-config");


let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(ENV.MONGODB_URL)
        await client.connect();
    }
}

async function signUp(req, res) {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }


    try {
        await connectClient();
        const db = client.db("GithubCloneDB");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ username });

        const emailId = await usersCollection.findOne({ email });

        if (user || emailId) {
            return res.status(400).json({ message: "User already exists. Please Use another username || email" });
        }

        const salt = await bcrypt.genSalt(14);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepos: [],
        }


        const result = await usersCollection.insertOne(newUser);
        const token = jwt.sign({ id: result.insertedId }, ENV.JWT_SECRET_KEY, { expiresIn: "7d" });
        res.status(201).json({ token, userId: result.insertedId, message: "User created successfully!!" });


    } catch (error) {
        console.error("Error in signup", error.message);
        res.status(500).send("Internal Server Error");
    }
}


const getAllUsers = async (req, res) => {
    try {
        await connectClient();
        const db = client.db("GithubCloneDB");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();

        res.status(200).json({ users });

    } catch (error) {
        console.error("Error during fetching all users", error.message);
        res.status(500).send("Internal Server Error");
    }
}


const login = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }


    try {
        await connectClient();
        const db = client.db("GithubCloneDB");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Inavalid credentials!! " });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Inavalid credentials!! " });
        }

        const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET_KEY, { expiresIn: "9d" });

        res.status(200).json({ token, userId: user._id, message: "Login successfully" });

    } catch (error) {
        console.error("Error in login : ", error.message);
        res.status(500).send("Internal Server Error");

    }
}

const getUserProfile = async (req, res) => {
    const currentId = req.params.id;

    if (!ObjectId.isValid(currentId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        await connectClient();
        const db = client.db("GithubCloneDB");
        const usersCollection = db.collection("users");



        const user = await usersCollection.findOne({ _id: new ObjectId(currentId) }, { projection: { password: 0 } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user, message: "User profile fetched successfully" });

    } catch (error) {
        console.error("Error in getting user profile", error.message);
        res.status(500).send("Internal Server Error");
    }
}


const updateUserProfile = async (req, res) => {


    const currentId = req.params.id;


    if (!ObjectId.isValid(currentId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const { email, password } = req.body || {};

    if (!email && !password) {
        return res.status(400).json({ message: "You Cant Leave Email or Password Completely Empty" });
    }

    try {

        await connectClient();
        const db = client.db("GithubCloneDB");
        const usersCollection = db.collection("users");


        let updateFields = {};

        if (email) {
            updateFields.email = email;
        }

        if (password) {
            const salt = await bcrypt.genSalt(14);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await usersCollection.findOneAndUpdate({ _id: new ObjectId(currentId) }, { $set: updateFields }, { returnDocument: "after" , projection: { password: 0 } });
       


        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: result, message: "User profile updated successfully" });


    } catch (error) {
        console.error("Error in updating user profile", error.message);
        res.status(500).send("Internal Server Error");
    }
}



const toggleStarRepo = async (req, res) => {
  try {
    const { userId, repoId } = req.body;

    if (!userId || !repoId) {
      return res.status(400).json({ message: "UserId and RepoId are required" });
    }

    await connectClient();
    const db = client.db("GithubCloneDB");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) return res.status(404).json({ message: "User not found" });

    const hasStarred = user.starRepos?.some(id => id.toString() === repoId);

    let message;
    if (hasStarred) {
      // Remove star
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { starRepos: new ObjectId(repoId) } }
      );
      message = "Repository unstarred successfully";
    } else {
      // Add star
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { starRepos: new ObjectId(repoId) } }
      );
      message = "Repository starred successfully";
    }

    // Fetch updated user to return the new count
    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { starRepos: 1 } }
    );

    res.status(200).json({
      message,
      starred: !hasStarred,
      starCount: updatedUser.starRepos.length
    });
  } catch (err) {
    console.error("Star toggle error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { password } = req.body || {};

  if (!ObjectId.isValid(currentId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    await connectClient();
    const db = client.db("GithubCloneDB");
    const usersCollection = db.collection("users");
    const reposCollection = db.collection("repositories");
    const issuesCollection = db.collection("issues");

    // 1️⃣ Validate user
    const user = await usersCollection.findOne({ _id: new ObjectId(currentId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Password incorrect. Please try again with correct password :)" });
    }

    // 2️⃣ Find all repositories created by this user
    const userRepos = await reposCollection.find({ owner: new ObjectId(currentId) }).toArray();

    for (const repo of userRepos) {
      // 3️⃣ Delete all files from S3
      if (repo.files && repo.files.length > 0) {
        const deleteParams = {
          Bucket: S3_BUCKET,
          Delete: {
            Objects: repo.files.map(file => ({ Key: file.key }))
          }
        };

        await s3.deleteObjects(deleteParams).promise();
      }

      // 4️⃣ Delete all issues of this repository
      if (repo.issues && repo.issues.length > 0) {
        await issuesCollection.deleteMany({ _id: { $in: repo.issues } });
      }

      // 5️⃣ Delete the repository itself
      await reposCollection.deleteOne({ _id: repo._id });
    }

    // 6️⃣ Delete the user
    const result = await usersCollection.deleteOne({ _id: new ObjectId(currentId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User profile, repositories, files, and issues deleted successfully" });

  } catch (error) {
    console.error("Error in deleting user profile", error.message);
    res.status(500).send("Internal Server Error");
  }
};


const followUser = async (req, res) => {
  try {
    const { myId, targetUserId } = req.body;

    if (!myId || !targetUserId) {
      return res.status(400).json({ message: "Ids are required" });
    }

    if (myId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    await connectClient();
    const db = client.db("GithubCloneDB");
    const usersCollection = db.collection("users");

    const me = await usersCollection.findOne({ _id: new ObjectId(myId) });
    const target = await usersCollection.findOne({ _id: new ObjectId(targetUserId) });

    if (!me || !target) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = me.followedUsers?.some(
      (id) => id.toString() === targetUserId
    );

    if (alreadyFollowing) {
      return res.status(400).json({ message: "Already following" });
    }

    // add in my following
    await usersCollection.updateOne(
      { _id: new ObjectId(myId) },
      { $push: { followedUsers: new ObjectId(targetUserId) } }
    );

    // add in his followers
    await usersCollection.updateOne(
      { _id: new ObjectId(targetUserId) },
      { $push: { followers: new ObjectId(myId) } }
    );

    res.status(200).json({ message: "Followed user successfully" });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: error.message });
  }
};


const unfollowUser = async (req, res) => {
  try {
    const { myId, targetUserId } = req.body;

    await connectClient();
    const db = client.db("GithubCloneDB");
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { _id: new ObjectId(myId) },
      { $pull: { followedUsers: new ObjectId(targetUserId) } }
    );

    await usersCollection.updateOne(
      { _id: new ObjectId(targetUserId) },
      { $pull: { followers: new ObjectId(myId) } }
    );

    res.status(200).json({ message: "Unfollowed user successfully" });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
    getAllUsers,
    signUp,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    followUser,
    unfollowUser,
    toggleStarRepo,
}