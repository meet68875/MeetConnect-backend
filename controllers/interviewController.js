import Interview from '../models/Interview.js';
import User from '../models/User.js';

// Create a new interview (POST)
export const scheduleInterview = async (req, res) => {
  const { position, company, interviewType, date, interviewer, location, notes } = req.body;

  try {
    const interview = new Interview({
      user: req.user.id,
      position,
      company,
      interviewType,
      date,
      interviewer,
      location,
      notes,
    });

    const savedInterview = await interview.save();
    
    // Add interview to user's interview list
    await User.findByIdAndUpdate(req.user.id, {
      $push: { interviews: savedInterview._id },
    });

    res.status(201).json(savedInterview);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error scheduling interview' });
  }
};


export const getUserInterviews = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query; // Add page and limit
  const skip = (page - 1) * limit;

  try {
    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const totalInterviews = await Interview.countDocuments(query); // Get total count
    const interviews = await Interview.find(query)
      .skip(skip) // Skip documents
      .limit(parseInt(limit)) // Limit the number of documents
      .populate('user');

    res.json({
      interviews,
      totalPages: Math.ceil(totalInterviews / limit),
      currentPage: parseInt(page),
      totalInterviews,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error fetching interviews' });
  }
};


export const updateInterviewStatus = async (req, res) => {
  const { interviewId } = req.params;
  const { feedback, score, result } = req.body;

  try {
    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      {
        status: 'Completed',
        feedback,
        score,
        result,
      },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error updating interview' });
  }
};

export const updateInterviewDetails = async (req, res) => {
    const { interviewId } = req.params;
    const updateFields = req.body;

    try {
        const interview = await Interview.findOneAndUpdate(
            { _id: interviewId, user: req.user.id },
            { ...updateFields },
            { new: true, runValidators: true }
        );

        if (!interview) {
            return res.status(404).json({ message: "Interview not found or unauthorized" });
        }

        res.json(interview);
    } catch (error) {
        console.error("Error updating interview:", error.message);
        res.status(500).json({ message: "Error updating interview details" });
    }
};
