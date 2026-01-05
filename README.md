# Watchtower AI 🕵️‍♂️

**Watchtower AI** is a powerful, browser-based intelligent security tool that turns your webcam into a smart surveillance system. Leveraging the power of TensorFlow.js and the COCO-SSD model, it performs real-time object detection directly in your browser without sending video data to any server.

## 🌟 Key Features

*   **Real-time Object Detection**: Instantly identifies objects in the video feed using the SSD MobileNet V2 model.
*   **Smart Human Detection**:
    *   **Visual Alert**: Highlights detected persons with a <span style="color: #FF0F0F">**RED**</span> bounding box (other objects are <span style="color: #00B612">**GREEN**</span>).
    *   **Audio Alert**: Emits a beep sound when a person is detected (volume adjustable).
*   **Auto-Recording**: Automatically starts recording a video clip when a person is detected (can be toggled on/off).
*   **Manual Controls**:
    *   📸 **Snapshots**: Capture high-quality images from the live feed.
    *   📽️ **Video Recording**: Manually start and stop video recording.
    *   🔊 **Volume Control**: Adjust the alert volume via a slider.
    *   ↔️ **Flip Camera**: Mirror the video feed for better viewing.
*   **Theme Support**: Toggle between Dark Mode and System Theme for a comfortable user experience.

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (React)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **AI/ML**: [TensorFlow.js](https://www.tensorflow.org/js) (@tensorflow-models/coco-ssd)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) (Icons)
*   **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
*   **State Management**: React Hooks (useState, useRef, useEffect)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   npm (comes with Node.js)

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd watchtower-ai
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the development server**:
    ```bash
    npm run dev
    ```

2.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

    > **Note:** You will need to grant permission for the browser to access your webcam.

## 📖 Usage Guide

1.  **Grant Permissions**: Allow camera access when prompted.
2.  **Wait for Model Load**: You will see a "Getting things ready" loader. Once the AI model is loaded, the video feed will appear.
3.  **Surveillance Mode**:
    *   The app continuously scans for objects.
    *   If a **Person** is seen, the box turns **RED**, and if alerts are enabled, a sound will play.
    *   If **Auto-Record** is on, it will save a video clip of the intrusion.
4.  **Control Panel**: Use the panel on the right to:
    *   Toggle themes.
    *   Flip the camera.
    *   Take a manual snapshot or recording.
    *   Enable/Disable auto-record.
    *   Adjust notification volume.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

[MIT](LICENSE)
