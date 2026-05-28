# Use a slim Python image
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy your requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code
COPY . .

# Tell the container which command to run to start your API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]