import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about">
      <h1>About My ToDo App</h1>
      <p>
        Welcome to the ToDo App, a simple yet powerful tool designed to help you
        organize and manage your tasks efficiently. Whether you're managing personal
        tasks, keeping track of work deadlines, or just organizing your day, this app
        will help you stay productive and focused.
      </p>
      <h2>Key Features:</h2>
      <ul>
        <li>Add, edit, and delete tasks effortlessly</li>
        <li>Mark tasks as completed or active</li>
        <li>Filter tasks by their status: All, Active, Completed</li>
        <li>Simple, clean, and intuitive interface</li>
      </ul>
      <p>
        This app was built using modern web technologies such as React, offering a 
        seamless and responsive experience across all devices.
      </p>
      <h2>Why I Built This App:</h2>
      <p>
        I built this ToDo app as a way to simplify task management in a busy world. 
        I wanted to create a minimalistic and easy-to-use application where users can 
        quickly add tasks, track their progress, and manage their daily to-do list without
        being overwhelmed by unnecessary features. It's designed to make task management 
        intuitive and accessible for everyone.
      </p>
      <p>
        Thank you for using the ToDo App. Stay organized and productive!
      </p>
    </div>
  );
}

export default About;
