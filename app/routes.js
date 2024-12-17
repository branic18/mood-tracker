module.exports = function(app, passport) {

const moodActions = {
    "happy": [
        "Keep up the good work!",
        "Celebrate with friends or family.",
        "Do something creative to express your happiness."
    ],
    "sad": [
        "Spend time with family and friends.",
        "Try to get outside and get some fresh air.",
        "Listen to your favorite uplifting music."
    ],
    "angry": [
        "Go for a run to release some energy.",
        "Practice deep breathing exercises.",
        "Journal your feelings to process the anger."
    ],
    "stressed": [
        "Take a break and do something relaxing.",
        "Try mindfulness or meditation.",
        "Talk to someone you trust about what's on your mind."
    ],
    "excited": [
        "Share your excitement with someone!",
        "Plan something fun to do.",
        "Try channeling this energy into a productive task."
    ],
   "neutral": [
       "Take a walk outdoors.",
       "Do a creative activity like journaling or drawing.",
       "Listen to a podcast or watch a TV show you enjoy."
   ]
};


// normal routes ===============================================================

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    const Mood = require('./models/mood'); 

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, async function(req, res) {
        try {
       
            const user = req.user || null; 
           
            const moodCollection = await Mood.find({ userId: req.user._id }); 
            
            res.render('profile', { user, moodCollection });
        } catch (err) {
            console.log('Error fetching moods:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// Mood Routes ===============================================================

// Submit a new mood
app.post('/submitMood', (req, res) => {
  const { mood, 'date-entry': date } = req.body;

  console.log('Received mood:', mood); 
  console.log('Received date:', date);

  if (!date) {
    return res.status(400).send("Date is required.");
}

  const parsedDate = new Date(date);
  console.log('Received this as a parsed date:', parsedDate);

  if (isNaN(parsedDate)) {
      return res.status(400).send("Invalid date provided.");
  }

  const actions = moodActions[mood] || ["No suggestions available for this mood."];

  const newMood = new Mood({
      userId: req.user._id, 
      mood: mood,
      date: parsedDate,  
      actions: actions   
  });

  // Save the mood to the database
  newMood.save((err, savedMood) => {
      if (err) {
          console.log(err);
          return res.status(500).send('Error saving mood.');
      }
      console.log('Mood saved to database:', savedMood);
      res.redirect('/profile'); 
  });
});


// Edit mood

app.put('/mood/:id', async (req, res) => {
    const moodId = req.params.id;
    const { mood, 'date': date } = req.body;

    try {
        // Validate the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
            return res.status(400).send({ message: "Invalid date provided." });
        }

        console.log('Updating mood:', { moodId, mood, date: parsedDate });

        const actions = moodActions[mood] || ["No suggestions available for this mood."];

        const result = await Mood.updateOne(
            { _id: moodId },
            { $set: { mood: mood, date: parsedDate, actions: actions } } 
        );

        if (result.nModified === 0) {
            console.error(`No document found with ID: ${moodId}`);
            return res.status(404).send({ message: "Mood not found or no changes were made." });
        }

        console.log('Mood updated successfully!');
        res.redirect('/profile');
    } catch (error) {
        res.status(500).send({ message: "Error updating mood" });
    }
});
  
app.delete('/deleteMood/:id', (req, res) => {
    const moodId = req.params.id;
    Mood.findByIdAndDelete(moodId, (err, result) => {
        if (err) return res.status(500).send({ message: "Error deleting mood" });
        if (!result) return res.status(404).send({ message: "Mood not found" });
        res.send({ message: "Mood deleted successfully" });
    });
});






// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') }); // Find out what flash method is
        }); // User sees the response

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', { // looks in passport file , uses the user model on line 7, then look in user.js file (hash is here, you never want to store passwords in plain text. You always ant to hash it)
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages. Show the user why they failed
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) // If authenticated return it
        return next(); // Function built into express

    res.redirect('/'); // If not redirect the user to the homepage
}
