import User from "../model/userModel.js";

export const add = async (req, res) => {
  try {
    const userData = new User(req.body);
    if (!userData) {
      return res.status(404).json({ msg: "user data not found" });
    }
    const savedData = await userData.save();
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const matchStage = {
      $match: {
        $or: [
          { name: { $regex: new RegExp(search, "i") } },
          { email: { $regex: new RegExp(search, "i") } },
          { phone: { $regex: new RegExp(search, "i") } },
        ],
      },
    };

    const skipStage = { $skip: (page - 1) * limit };
    const limitStage = { $limit: parseInt(limit) };

    const pipeline = [
      matchStage,
      {
        $facet: {
          searchResults: [skipStage, limitStage],

          totalCount: [{ $count: "value" }],
        },
      },
      {
        $project: {
          searchResults: 1,

          totalCount: { $arrayElemAt: ["$totalCount.value", 0] },
        },
      },
    ];

    const result = await User.aggregate(pipeline);

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "user not found" });
    }
    const updatedata = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedata);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "user not found" });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ msg: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
