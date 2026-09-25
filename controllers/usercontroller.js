const User = require("../AI models/user");

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message
    });
  }
};


// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      error: error.message
    });
  }
};


// Add family member
exports.addFamilyMember = async (req, res) => {
  try {
    const { name, age, gender, relation } = req.body;

    const user = await User.findById(req.user.id);

    user.familyMembers.push({
      name,
      age,
      gender,
      relation
    });

    await user.save();

    res.status(201).json({
      message: "Family member added",
      familyMembers: user.familyMembers
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add family member",
      error: error.message
    });
  }
};