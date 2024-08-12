// backend/src/app.js
const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const path = require("path");

dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));
// Configure Multer storage
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  },
});

const upload = multer({ storage: storage });

// Create a new product
app.post(
  "/api/createProduct/:user_id",
  upload.single("image"),
  async (req, res) => {
    const { user_id } = req.params;
    const { productName, price, description, offer } = req.body;
    const image = req.file ? req.file.path : null;

    try {
      const isUser = await prisma.user.findUnique({ where: { id: user_id } });
      if (!isUser) {
        throw "User not found.";
      }

      const parsedPrice = parseFloat(price);
      const parsedOffer = parseFloat(offer);

      const newProduct = await prisma.products.create({
        data: {
          userId: isUser?.id,
          productName,
          product_price: parsedPrice,
          product_description: description,
          product_offer: parsedOffer,
          image: image,
        },
      });
      res.status(201).json({
        message: "Products created successfully.",
        status: 1,
        data: newProduct,
      });
    } catch (error) {
      console.log(error);
      if (error === "User not found.") {
        res.status(201).json({
          message: error,
          status: 1,
        });
      }
      res.status(500).json({ message: error, status: 0 });
    }
  }
);

// Get all products
app.get("/api/getAllProducts", async (req, res) => {
  try {
    const products = await prisma.products.findMany();
    const productsWithImageUrl = products.map((product) => ({
      ...product,
      image: `${req.protocol}://${req.get("host")}/uploads/${path.basename(
        product.image
      )}`,
    }));
    res.status(200).json({
      message: "All items fetched successfully",
      status: 1,
      data: productsWithImageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "No data Found", status: 0 });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw "User already Exists. So, Please login with this email id.";
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "user",
        },
      });
      if (createUser) {
        res.status(201).json({
          message: "User Created Successfully.",
          status: 1,
          data: createUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    if (error === "User already Exists. So, Please login with this email id.") {
      res.status(200).json({
        message: error,
        status: 0,
      });
    } else {
      res.status(400).json({
        message: error,
        status: 0,
      });
    }
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      throw "User Not Found.";
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      throw "Password does not match.";
    }
    const accessToken = await jwt.sign(
      { email: email },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );

    if (existingUser && isPasswordMatch) {
      res.status(200).json({
        message: "User Logged in Successfully.",
        data: { ...existingUser, accessToken: accessToken },
        status: 1,
      });
    }
  } catch (error) {
    console.log(error);
    if (error === "User Not Found." || "Password does not match.") {
      res.status(200).json({
        message: error,
        status: 0,
      });
    } else {
      res.status(400).json({
        message: error,
        status: 0,
      });
    }
  }
});

app.get("/api/getUser/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const isUser = await prisma.user.findUnique({
      where: { id: user_id },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
      },
    });
    if (!isUser) {
      throw "User not found.";
    } else {
      res.status(200).json({
        message: "user fetched successfully.",
        status: 1,
        data: isUser,
      });
    }
  } catch (error) {
    if (error === "User not found.") {
      res.status(200).json({
        message: error,
        status: 1,
      });
    } else {
      res.status(500).json({
        message: "Internal server error.",
        status: 0,
      });
    }
  }
});

app.delete("/api/deleteProduct/:product_id", async (req, res) => {
  try {
    const isProduct = await prisma.products.delete({
      where: { product_id: req.params.product_id },
    });
    if (!isProduct) {
      throw "Product not found.";
    } else {
      res.status(200).json({
        message: "Product Deleted successfully.",
        status: 1,
      });
    }
  } catch (error) {
    if (error === "Product not found.") {
      res.status(200).json({
        message: error,
        status: 1,
      });
    } else {
      res.status(500).json({
        message: "Internal server error.",
        status: 0,
      });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
