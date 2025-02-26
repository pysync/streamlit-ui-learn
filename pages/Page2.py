import streamlit as st
import cv2
import numpy as np
from PIL import Image

st.set_page_config(page_title="Image Upload & Processing", layout="wide")
st.title("📷 Upload and Process Image with OpenCV")

# Upload image
uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    # Convert file to OpenCV format
    file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
    image = cv2.imdecode(file_bytes, 1)  # Read as BGR

    # Display Original Image
    st.image(image, caption="Original Image", channels="BGR", use_container_width=True)

    # Convert to Grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Edge Detection (Canny)
    edges = cv2.Canny(gray_image, 100, 200)

    # Display Processed Images
    st.image(gray_image, caption="Grayscale Image", use_container_width=True)
    st.image(edges, caption="Edge Detection (Canny)", use_container_width=True)
