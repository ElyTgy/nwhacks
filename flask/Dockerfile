# Use the official Python image as a base
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy only requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application after installing dependencies (improves build caching)
COPY . .

# Expose port 5000 to allow communication to/from the container
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
