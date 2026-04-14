import { useRef } from 'react';
import emailjs from '@emailjs/browser';

const refForm = useRef();

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

export default Contact