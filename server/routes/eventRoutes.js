const express = require('express');
const router = express.Router();
const db = require('../config/db');
const moment = require('moment');

// Get all events
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events');
    const adjustedEvents = rows.map(event => ({
      ...event,
      date: moment(event.date).local().format('YYYY-MM-DD'), // Convert to local and simplify
    }));
    res.json(adjustedEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  const { title, date, location, description, category } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO events (title, date, location, description, category) VALUES (?, ?, ?, ?, ?)',
      [title, date, location, description, category]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  const { title, date, location, description, category } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE events SET title = ?, date = ?, location = ?, description = ?, category = ? WHERE id = ?',
      [title, date, location, description, category, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
