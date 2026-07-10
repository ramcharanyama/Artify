import React, { useState } from 'react';
import { validateEmail, validateRequired } from '../utils/validators';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameCheck = validateRequired(name, 'Name');
    const emailCheck = validateEmail(email);
    const subjectCheck = validateRequired(subject, 'Subject');
    const msgCheck = validateRequired(message, 'Message');

    const newErrors = {};
    if (!nameCheck.isValid) newErrors.name = nameCheck.message;
    if (!emailCheck.isValid) newErrors.email = emailCheck.message;
    if (!subjectCheck.isValid) newErrors.subject = subjectCheck.message;
    if (!msgCheck.isValid) newErrors.message = msgCheck.message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate contact form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your message has been received! We will get back to you within 24 hours.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="ajio-contact bg-light-gray py-5">
      <div className="container py-4 bg-white border p-5 rounded-0">

        {/* Header */}
        <div className="text-center mb-5 max-w-700 mx-auto">
          <span className="text-uppercase text-ajio-red font-weight-bold text-xs letter-spacing-2 mb-2 block">Get In Touch</span>
          <h1 className="text-uppercase font-weight-black text-dark mb-3 letter-spacing-1 h2">WE WOULD LOVE TO HEAR FROM YOU</h1>
          <p className="text-muted fs-7">Have questions about an artwork, delivery times, custom commissions, or onboarding as an artist? Drop us a line below.</p>
        </div>

        <div className="row g-5">
          {/* Left Column - Contact Form */}
          <div className="col-md-7">
            <h2 className="text-uppercase font-weight-bold text-dark mb-4 letter-spacing-1 h5">SEND MESSAGE</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">

                {/* Name */}
                <div className="col-md-6 form-group mb-3">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Your Name</label>
                  <input
                    type="text"
                    className={`form-control rounded-0 py-2 ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <div className="invalid-feedback fs-8">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="col-md-6 form-group mb-3">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Email Address</label>
                  <input
                    type="email"
                    className={`form-control rounded-0 py-2 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className="invalid-feedback fs-8">{errors.email}</div>}
                </div>

                {/* Subject */}
                <div className="col-12 form-group mb-3">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Subject</label>
                  <input
                    type="text"
                    className={`form-control rounded-0 py-2 ${errors.subject ? 'is-invalid' : ''}`}
                    placeholder="Enter subject topic"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  {errors.subject && <div className="invalid-feedback fs-8">{errors.subject}</div>}
                </div>

                {/* Message */}
                <div className="col-12 form-group mb-4">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Message Content</label>
                  <textarea
                    rows="5"
                    className={`form-control rounded-0 ${errors.message ? 'is-invalid' : ''}`}
                    placeholder="Write details of your query..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  {errors.message && <div className="invalid-feedback fs-8">{errors.message}</div>}
                </div>

                {/* Submit button */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-ajio-red rounded-0 px-4 py-3 text-uppercase font-weight-bold letter-spacing-1 fs-7"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Info Cards + Map */}
          <div className="col-md-5 d-flex flex-column gap-4">

            {/* Info Cards */}
            <div className="border bg-light-gray p-4">
              <h3 className="h6 text-uppercase font-weight-bold text-dark mb-3 letter-spacing-1">HEAD OFFICE</h3>

              <div className="d-flex align-items-start gap-3 mb-3">
                <FaMapMarkerAlt className="text-ajio-red mt-1 flex-shrink-0" />
                <span className="fs-7 text-muted">
                  BVRIT College, Narsapur,Medak District, Telangana - 502313, India
                </span>
              </div>

              <div className="d-flex align-items-center gap-3 mb-3">
                <FaPhoneAlt className="text-ajio-red flex-shrink-0" />
                <span className="fs-7 text-muted">+91 90000 00000</span>
              </div>

              <div className="d-flex align-items-center gap-3">
                <FaEnvelope className="text-ajio-red flex-shrink-0" />
                <span className="fs-7 text-muted">support@artify.com</span>
              </div>
            </div>

            {/* Simulated Map */}
            <div className="border border-light flex-grow-1 position-relative bg-light-gray d-flex flex-column align-items-center justify-content-center text-center p-4" style={{ minHeight: '220px' }}>
              <div className="text-ajio-red mb-2">
                <FaMapMarkerAlt size={28} />
              </div>
              <span className="font-weight-bold text-dark text-uppercase fs-8 letter-spacing-1 block mb-1">BVRIT College View </span>
              <span className="text-muted fs-8 block">Map widget simulated. Click to open in Google Maps.</span>
              <a
                href="https://maps.app.goo.gl/5iSrAzAGR88hME8D6?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark btn-sm rounded-0 text-uppercase text-xs font-weight-bold mt-3 px-3"
              >
                Open Google Maps
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
