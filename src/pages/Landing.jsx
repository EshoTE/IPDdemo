import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import stockVideo from '/13109981_1920_1080_25fps.mp4';
import stockPic from '/Group-of-around-20-students-in-Brussels-as-part-of-the-Westminster-Work.jpg'
import { IoPieChart } from "react-icons/io5";
import { IoFootstepsOutline } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Landing() {
  const refForm = useRef();
  const navigate = useNavigate();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        'service_oil44jb',
        'template_c52iupf',
        refForm.current,
        'bnz4TxFhDK04hsoCZ'
      )
      .then(
        () => {
          alert('Message successfully sent!');
          window.location.reload(false);
        },
        () => {
          alert('Failed to send the message, please try again');
        }
      );
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const data = [
    {
      name: "Track expenses",
      img: <IoFootstepsOutline />,
      descr: "Stay on top of every penny. Log and categorise your daily spending so you always know where your money is going throughout the term.",
    },
    {
      name: "Recieve Overspending Alerts",
      img: <FaExclamation />,
      descr: "Never get caught off guard. TermTrack notifies you when you're approaching your budget limit so you can adjust before it's too late.",
    },
    {
      name: "Financial Overview",
      img: <IoPieChart />,
      descr: "See the bigger picture. Get a clear visual breakdown of your income and expenses to understand your spending habits at a glance.",
    },
  ];

  return (
    <div className="relative">

      <div className="relative h-screen overflow-hidden">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        >
          <source src={stockVideo} type="video/mp4" />
        </video>

        <div className="absolute top-0 left-0 w-full h-full bg-black/60 -z-10"></div>

        <nav className="flex justify-end items-center gap-1 h-14 border-b border-white/10 px-8">
          <h1 className="mr-auto text-white text-3xl font-bold">TermTrack</h1>
          <div className="flex gap-6">
            <a href="#about" className="text-white">About</a>
            <a href="#features" className="text-white">Features</a>
            <a href="#contact" className="text-white">Contact</a>
          </div>
        </nav>

        <div className="m-20 font-bold text-5xl text-white w-120">
          <p>Where your finance truly matters</p>
        </div>

        <button className="mt-0 m-20 w-50 h-15 text-white border border-amber-50 px-8 py-3 hover:bg-white/10 transition-colors">
          Get Started
        </button>

      </div>

      <section id="about" className="min-h-screen bg-gray-950 border-t border-purple-900/30 py-20">
        <h2 className="text-center text-white text-4xl font-bold mb-16">About</h2>
        <div className="flex flex-col items-center gap-12 px-20">
          <p className="text-gray-300 text-xl px-8 leading-relaxed text-center">
            TermTrack helps university students take control of their finances. Built to simplify
            budgeting, our platform calculates your daily spending allowance based on your student
            loan and term dates, tracks expenses by category, and sends alerts when you're at risk
            of overspending. Say goodbye to financial stress and hello to smarter money management.
          </p>
          <div className="w-[900px] h-[400px] rounded-xl overflow-hidden flex-shrink-0">
            <img src={stockPic} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section id="features" className="min-h-screen bg-gray-950 border-t border-purple-900/30 py-20">
        <h2 className="text-center text-white text-4xl font-bold mb-16">Features</h2>
        <p className="text-center text-gray-400 mb-16">Everything you need to manage your student finances</p>
        <div className="flex justify-center items-center">
          <div className="w-[650px] mt-20">
            <Slider {...settings}>
              {data.map((d, index) => (
                <div key={index}>
                  <div className="h-[450px] rounded-2xl mx-2 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="text-gray-400 text-9xl flex justify-center items-center h-56 drop-shadow-[0_0_15px_rgba(156,163,175,0.8)]">
                      {d.img}
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4 px-8">
                      <p className="text-white text-xl font-bold">{d.name}</p>
                      <p className="text-gray-300 text-center text-sm leading-relaxed">{d.descr}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section id="contact" className="min-h-screen bg-gray-950 border-t border-gray-800/30 py-20">
        <h2 className="text-center text-white text-4xl font-bold mb-4">Contact</h2>
        <p className="text-center text-gray-400 mb-16">Get in touch with the TermTrack team</p>
        <div className="flex justify-center items-center px-8">
          <div className="w-full max-w-2xl">
            <form ref={refForm} onSubmit={sendEmail} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  className="w-1/2 bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-1/2 bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                className="bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
              <textarea
                name="message"
                placeholder="Message"
                required
                rows={6}
                className="bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 text-white border border-gray-700 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold tracking-wide"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Landing;