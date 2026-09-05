import { useState } from 'react'
import posthog from 'posthog-js'
import './App.css'

const tutors = [
  {
    name: 'Maya Chen',
    subjects: 'Elementary Math · Algebra I · Algebra II',
    description: 'Patient and encouraging math tutor.',
    times: ['Mon 4:00 PM', 'Tue 5:30 PM'],
  },
  {
    name: 'Jordan Lee',
    subjects: 'Elementary Reading · Science',
    description: 'Friendly tutor focused on younger students.',
    times: ['Wed 3:30 PM', 'Thu 5:00 PM'],
  },
  {
    name: 'Alex Rivera',
    subjects: 'Elementary Math · Science',
    description: 'Supportive tutor who makes learning approachable.',
    times: ['Fri 4:30 PM', 'Sat 10:00 AM'],
  },
]

function App() {
  const [view, setView] = useState('parents')
  const [selected, setSelected] = useState(null)
  const [bookings, setBookings] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [confirmed, setConfirmed] = useState(null)

  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [grade, setGrade] = useState('')
  const [subject, setSubject] = useState('')

  function startBooking(tutor, time) {
    setSelected({ tutor, time })
    setConfirmed(null)

    posthog.capture('tutor_viewed', {
      tutor_name: tutor.name,
    })

    posthog.capture('booking_started', {
      tutor_name: tutor.name,
      selected_time: time,
    })
  }

  function submitBooking(e) {
    e.preventDefault()

    const booking = {
      parent: parentName,
      email,
      grade,
      subject,
      tutor: selected.tutor.name,
      time: selected.time,
    }

    setBookings((old) => [...old, booking])
    setBookedSlots((old) => [
      ...old,
      `${selected.tutor.name}-${selected.time}`,
    ])

    setConfirmed(booking)

    posthog.capture('booking_completed', {
      tutor_name: booking.tutor,
      selected_time: booking.time,
      subject: booking.subject,
      grade: booking.grade,
    })

    setSelected(null)
    setParentName('')
    setEmail('')
    setGrade('')
    setSubject('')
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <span className="plant">🌱</span>
          <span>BrightPath Tutoring</span>
        </div>

        <div className="nav-buttons">
          <button
            className={view === 'parents' ? 'active' : ''}
            onClick={() => setView('parents')}
          >
            Find a Tutor
          </button>

          <button
            className={view === 'dana' ? 'active' : ''}
            onClick={() => setView('dana')}
          >
            Dana's Dashboard
          </button>
        </div>
      </header>

      {view === 'parents' && (
        <main>
          <section className="hero">
            <div>
              <p className="small-title">BRIGHTPATH TUTORING</p>
              <h1>Find the right tutor for your child.</h1>
              <p className="hero-text">
                Choose a tutor, pick an available time, and book in minutes.
              </p>
            </div>

            <div className="tree">
              🌿
            </div>
          </section>

          {confirmed && (
            <div className="confirmation">
              <div className="check">✓</div>

              <div>
                <strong>Booking confirmed!</strong>
                <p>
                  {confirmed.tutor} · {confirmed.time}
                </p>
                <span>
                  A confirmation would be sent to {confirmed.email}.
                </span>
              </div>
            </div>
          )}

          <section className="tutors">
            {tutors.map((tutor) => (
              <article className="tutor-card" key={tutor.name}>
                <div className="initials">
                  {tutor.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>

                <h2>{tutor.name}</h2>

                <p className="subjects">{tutor.subjects}</p>

                <p className="description">{tutor.description}</p>

                <p className="availability">Available times</p>

                <div className="times">
                  {tutor.times.map((time) => {
                    const key = `${tutor.name}-${time}`
                    const isBooked = bookedSlots.includes(key)

                    return (
                      <button
                        key={time}
                        disabled={isBooked}
                        className={isBooked ? 'time booked' : 'time'}
                        onClick={() => startBooking(tutor, time)}
                      >
                        {isBooked ? 'Booked' : time}
                      </button>
                    )
                  })}
                </div>
              </article>
            ))}
          </section>

          {selected && (
            <section className="booking-card">
              <button
                className="back-button"
                onClick={() => setSelected(null)}
              >
                ← Back
              </button>

              <h2>Book with {selected.tutor.name}</h2>

              <div className="selected-time">
                {selected.time}
              </div>

              <form onSubmit={submitBooking}>
                <label>
                  Parent name
                  <input
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>

                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                  />
                </label>

                <div className="form-row">
                  <label>
                    Student grade
                    <select
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    >
                      <option value="">Select grade</option>
                      <option>Elementary</option>
                      <option>6th Grade</option>
                      <option>7th Grade</option>
                      <option>8th Grade</option>
                      <option>9th Grade</option>
                      <option>10th Grade</option>
                    </select>
                  </label>

                  <label>
                    Subject
                    <select
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option value="">Select subject</option>
                      <option>Elementary Math</option>
                      <option>Algebra I</option>
                      <option>Algebra II</option>
                      <option>Science</option>
                      <option>Elementary Reading</option>
                    </select>
                  </label>
                </div>

                <button className="confirm-button" type="submit">
                  Confirm booking
                </button>
              </form>
            </section>
          )}
        </main>
      )}

      {view === 'dana' && (
        <main>
          <section className="dana-heading">
            <div>
              <p className="small-title">DANA'S VIEW</p>
              <h1>Schedule & bookings</h1>
              <p>
                A simple view of what Dana could receive after parents book.
              </p>
            </div>

            <div className="growth-tree">🌳</div>
          </section>

          <div className="dashboard-grid">
            <section className="dashboard-card bookings-card">
              <div className="card-heading">
                <div>
                  <p className="small-title">GOOGLE SHEET MOCKUP</p>
                  <h2>Bookings</h2>
                </div>

                <span className="status">● Updated</span>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Parent</th>
                      <th>Tutor</th>
                      <th>Subject</th>
                      <th>Grade</th>
                      <th>Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty">
                          Make a booking in the Parent View and it will appear here.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking, i) => (
                        <tr key={i}>
                          <td>{booking.parent}</td>
                          <td>{booking.tutor}</td>
                          <td>{booking.subject}</td>
                          <td>{booking.grade}</td>
                          <td>{booking.time}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="dashboard-card">
              <p className="small-title">BOOKING ALERT</p>
              <h2>Notifications</h2>

              {bookings.length === 0 ? (
                <p className="empty-message">
                  Dana's email or text alerts would appear here.
                </p>
              ) : (
                <div className="alert">
                  <div className="mail">✉</div>

                  <div>
                    <strong>New booking received</strong>
                    <p>
                      {bookings[bookings.length - 1].tutor}
                    </p>
                    <p>
                      {bookings[bookings.length - 1].time}
                    </p>
                    <span>
                      Email/text sent to Dana
                    </span>
                  </div>
                </div>
              )}
            </section>
          </div>

          <section className="how-it-works">
            <h2>How it would work</h2>

            <div className="steps">
              <div>
                <span>1</span>
                Parent books a session
              </div>

              <div>→</div>

              <div>
                <span>2</span>
                Time becomes unavailable
              </div>

              <div>→</div>

              <div>
                <span>3</span>
                Booking is added to Dana's sheet
              </div>

              <div>→</div>

              <div>
                <span>4</span>
                Dana gets an email or text
              </div>
            </div>

            <p className="mock-note">
              For this prototype, the Google Sheet and notification are visual
              mockups showing how the full workflow could work.
            </p>
          </section>
        </main>
      )}
    </div>
  )
}

export default App