import streamlit as st
import matplotlib.pyplot as plt

st.title("Matplotlib 'Diagram' Example")

# This is a VERY basic example.  You'd need to write more code
# to parse text and create a meaningful diagram.  This is mostly
# illustrating the principle of using Matplotlib to draw something.

plt.figure(figsize=(4, 2))  # Adjust size as needed
plt.plot([0, 1], [0, 1], marker='o')  # Draw a line with markers
plt.xlabel("X-axis")
plt.ylabel("Y-axis")
plt.title("Simple Plot")

st.pyplot(plt)