import { Space } from "../models/space.js"; // Assuming Space model exists
import path from "path";

const createSpace = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    console.log(req.user);
    const {
      title,
      location,
      monthlyRent,
      roomType,
      description,
      amenities,
      flatmatePreferences,
    } = req.body;
    const userId = req.user.userId;
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    const space = new Space({
      userId,
      title,
      location,
      monthlyRent,
      roomType,
      description,
      images,
      amenities,
      flatmatePreferences,
    });

    await space.save();
    res.status(201).json({ status: "success", data: space });
  } catch (error) {
    console.error("Create space error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find({ user: req.user.id });
    res.status(200).json({ status: "success", data: spaces });
  } catch (error) {
    console.error("Get spaces error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    if (!space) {
      return res
        .status(404)
        .json({ status: "error", message: "Space not found" });
    }
    res.status(200).json({ status: "success", data: space });
  } catch (error) {
    console.error("Get space by ID error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const updateSpace = async (req, res) => {
  try {
    const {
      title,
      location,
      monthlyRent,
      roomType,
      description,
      amenities,
      flatmatePreferences,
    } = req.body;

    // Handle images
    const images = req.files ? req.files.map((file) => file.path()) : [];

    const updatedSpace = await Space.findByIdAndUpdate(
      req.params.id,
      {
        title,
        location,
        monthlyRent,
        roomType,
        description,
        images,
        amenities,
        flatmatePreferences,
      },
      { new: true }
    );

    if (!updatedSpace) {
      return res
        .status(404)
        .json({ status: "error", message: "Space not found" });
    }
    res.status(200).json({ status: "success", data: updatedSpace });
  } catch (error) {
    console.error("Update space error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const deleteSpace = async (req, res) => {
  try {
    const space = await Space.findByIdAndDelete(req.params.id);
    if (!space) {
      return res
        .status(404)
        .json({ status: "error", message: "Space not found" });
    }
    res
      .status(200)
      .json({ status: "success", message: "Space deleted successfully" });
  } catch (error) {
    console.error("Delete space error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const spaceController = {
  createSpace,
  getSpaces,
  getSpaceById,
  updateSpace,
  deleteSpace,
};
