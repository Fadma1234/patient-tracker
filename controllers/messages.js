const Message = require('../models/Message');
const User = require('../models/User');

exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id },
        { receiverId: req.user.id }
      ]
    }).populate('senderId receiverId').sort({ createdAt: -1 });

    const conversationMap = new Map();
    
    messages.forEach(msg => {
      const partnerId = msg.senderId._id.toString() === req.user.id 
        ? msg.receiverId._id.toString() 
        : msg.senderId._id.toString();
      
      if (!conversationMap.has(partnerId)) {
        const partner = msg.senderId._id.toString() === req.user.id 
          ? msg.receiverId 
          : msg.senderId;
        
        conversationMap.set(partnerId, {
          partner: partner,
          lastMessage: msg,
          unreadCount: 0
        });
      }
    });

    const conversations = Array.from(conversationMap.values());

    res.render('messages/index', { conversations });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading messages');
    res.redirect('/');
  }
};

exports.getConversation = async (req, res) => {
  try {
    const partner = await User.findById(req.params.userId);
    
    if (!partner) {
      req.flash('error', 'User not found');
      return res.redirect('/messages');
    }

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: req.params.userId, receiverId: req.user.id, read: false },
      { read: true }
    );

    res.render('messages/conversation', { partner, messages });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading conversation');
    res.redirect('/messages');
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;

    await Message.create({
      senderId: req.user.id,
      receiverId: req.params.userId,
      content: content
    });

    res.redirect('/messages/' + req.params.userId);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error sending message');
    res.redirect('/messages/' + req.params.userId);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { senderId: req.params.userId, receiverId: req.user.id, read: false },
      { read: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
};