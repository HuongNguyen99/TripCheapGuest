const Ticket = require("../models/ticket");

exports.createTicket = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');

  const ticket = new Ticket({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    price: req.body.price,
    percent: req.body.percent,
    category: req.body.category,
    categoryService: req.body.categoryService,
    price_reduce: req.body.price_reduce,
    city: req.body.city,
    quantity: req.body.quantity,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });

  ticket.save().then(createTicket => {
    res.status(201).json({
      message: "Ticket added successfully",
      ticket: {
        ...createTicket,
        id: createTicket._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a ticket failed!'
    })
  })
}

exports.updateTicket  = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const ticket = new Ticket({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    price: req.body.price,
    percent: req.body.percent,
    category: req.body.category,
    categoryService: req.body.categoryService,
    price_reduce: req.body.price_reduce,
    city: req.body.city,
    quantity: req.body.quantity,
    imagePath: imagePath
  });

  Ticket.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    ticket).then(result => {
      if(result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({
          message: "Not authorized!" });
      }

  }).catch(error => {
    res.status(500).json({
      message: "Couldn't update ticket!"
    })
  })
}

exports.getAllTicket = (req, res, next) => {
  Ticket.find().then(documents => {
    res.status(200).json({
      message: "Tickets fetched successfully!",
      ticket: documents
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching tickets failed!'
    })
  })
}

exports.getOneTicket = (req, res, next) => {
  console.log(Ticket.findById(req.params.id));
  Ticket.findById(req.params.id).then(ticket => {
    if (ticket) {
      res.status(200).json(ticket);
    } else {
      res.status(404).json({ message: "Ticket not found!" });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Fetching ticket failed!'
    })
  })
}

exports.getTicketOfCreator = (req, res, next) => {
  console.log('hello');
  console.log(req.params);
  Ticket.find({creator: req.params.creator}).then(documents => {
    res.status(200).json({
      message: "Tickets fetched successfully!",
      ticket: documents
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching tickets failed!'
    })
  })
}

exports.deleteOneTicket = (req, res, next) => {

  Ticket.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    result => {
    if(result.n > 0) {
      res.status(200).json({ message: "Ticket deleted!" });
     } else {
      res.status(401).json({ message: "Not authorized!" });
     }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching ticket failed!'
    })
  })
}




