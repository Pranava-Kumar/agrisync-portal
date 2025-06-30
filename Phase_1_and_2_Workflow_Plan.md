
### NIDAR Competition: Detailed Workflow for Phases 1 & 2 - System Architecture & Design

Overall Objective: To translate the NIDAR mission requirements and the finalized Bill of Materials into a complete, validated, and build-ready system design, and to procure all necessary components.

---

### Sub-Phase 1: Foundational Research & System Architecture (Target: Week 1)

Goal: To establish a unified team understanding of the mission and to create the master architectural blueprint for both drones. This is the strategic foundation for all subsequent work.

Task 1.1: Deep Dive & Mission Scenario Mapping
   Lead: Pranava Kumar
   Involves: All Team Members
   Guidance: This task goes beyond simply reading the rulebook. It's about internalizing the mission flow and defining what success looks like in concrete terms.
       Sub-task 1.1.1: Create a Mission Flowchart.
           Action: On a whiteboard or using a digital tool, visually map every step of the Precision Agriculture mission from start to finish.
           Example Flow: Pre-flight Checks -> Position on Launchpad -> GCS initiates Autonomous Takeoff -> Ascend to Scanning Altitude -> Execute Pre-planned Scan Pattern (2 Acres) -> Live Video Feed to GCS -> Onboard (Pi) Crop Stress Analysis -> IF Stressed Plant Detected -> Geotag with RTK Data -> Log & Transmit Coordinates to GCS -> Complete Scan -> Return to Launch -> Autonomous Landing -> Post-flight Analysis.
       Sub-task 1.1.2: Define Key Performance Parameters (KPPs).
           Action: Based on the scoring criteria, define your internal targets.
           Examples:
               Scanning Efficiency: Complete 2-acre scan in under 15 minutes.
               Detection Accuracy: Achieve >95% accuracy in identifying marked stressed plants.
               Geotagging Precision: Geotag locations with <10cm error (leveraging RTK).
               Spraying Precision: Deliver pesticide within the specified accuracy zones.

Task 1.2: Precision Agriculture Research & Application Strategy
   Lead: Hitarthi Sharma
   Involves: Dinesh Kumar, Pranava Kumar
   Guidance: This is where your domain expertise comes in. You need to define how you will solve the "precision agriculture" problem with your specific hardware.
       Sub-task 1.2.1: Research Visual Signatures of Crop Stress.
           Action (Hitarthi): Research the specific types of "yellow coloring/pigmentation" that can be detected by a standard RGB camera (your IMX219). Find sample images and document the color profiles (HSV/RGB values) that represent stress. This is critical input for the software team.
       Sub-task 1.2.2: Determine Optimal Scanning & Spraying Patterns.
           Action (Hitarthi, Dinesh): Research and decide on the most efficient flight path for scanning a 2-acre area (e.g., boustrophedon "lawnmower" pattern). This will be used to generate the KML file for the mission. Similarly, plan the most efficient path for the spraying drone to visit multiple geotagged locations.
       Sub-task 1.2.3: Define the Data & Command Pipeline.
           Action (Dinesh, Pranava): Formally document the flow of information.
           Example: Scout Drone's IMX219 captures video -> Stream sent to Raspberry Pi 5 -> Pi script analyzes frames for stress signatures -> IF stress detected, Pi requests current coordinates from Cube FC -> Pi combines image and RTK-corrected coordinates -> Pi sends "Stressed Plant Found" packet (with coords) to GCS via telemetry -> GCS UI plots a pin on the map.

Task 1.3: Finalize High-Level System Architecture
   Lead: Pranava Kumar (as Integrator)
   Involves: Arun Kumar, Mohana Divya, Dinesh Kumar
   Guidance: This is the deliverable for this sub-phase. You will create the master blueprints that guide the detailed design.
       Sub-task 1.3.1: Mechanical Layout Diagram (Arun).
           Action: Create top-down and side-view diagrams for both drones showing the physical placement of every major component from the BOM. Pay close attention to the Center of Gravity (CG). Place heavy items like batteries and payloads as close to the CG as possible.
       Sub-task 1.3.2: Electrical Block Diagram (Mohana).
           Action: Create a high-level diagram showing all electronic components as blocks and their power/data connections as lines. This is not a detailed pin-to-pin schematic yet.
           Example: A line from "Battery" to "PM02" and "PDB". Lines from "PDB" to all "ESCs". Lines from "PM02" to "Flight Controller". Data lines from "Flight Controller" to "Raspberry Pi", "GPS", "Telemetry", etc.
       Sub-task 1.3.3: Software & Data Flow Diagram (Dinesh).
           Action: Create a diagram showing the different software modules (e.g., "Flight Control Firmware," "GCS Application," "Vision Processing Script") and how data flows between them (e.g., "Telemetry Data," "Video Stream," "Control Commands," "Geotag Coordinates").

---

### Sub-Phase 2: Detailed Mechanical & Electrical Design (Target: Weeks 2-3)

Goal: To convert the architectural blueprints into precise, validated, and manufacturable designs. This phase makes the drones "real" in the digital world before any physical assembly begins.

Task 2.1: Detailed CAD Modeling
   Lead: Arun Kumar
   Guidance: This is the virtual build. The goal is to ensure everything fits perfectly and the drone is balanced before you build it.
       Sub-task 2.1.1: Model All Components.
           Action: In your CAD software (e.g., Fusion 360, SolidWorks), create or import models for every single component in your BOM. Use calipers to get exact dimensions of parts you have, or find spec sheets online.
       Sub-task 2.1.2: Create Full Drone Assemblies.
           Action: Assemble the components virtually onto the ZD850 and EFT E610P frames. Check for physical interferences. Does the gimbal have full range of motion? Do the folding arms clear the landing gear?
       Sub-task 2.1.3: Design for Manufacturing (DFM).
           Action: Design any custom parts (e.g., mounts for the camera, RTK mast, sensor brackets) with 3D printing in mind. Ensure they are strong, lightweight, and printable without excessive supports.
       Sub-task 2.1.4: Perform Detailed CG Analysis.
           Action: Assign material properties and weights to every component in the CAD model. Use the software's tools to calculate the precise Center of Gravity for both drones. Adjust component layouts as needed to ensure the CG is at the desired location (typically the center of thrust).

Task 2.2: Detailed Electrical Schematics & Wiring Plan
   Lead: Mohana Divya
   Guidance: This is the definitive guide for the electrical build. It eliminates guesswork and prevents catastrophic mistakes like reverse polarity.
       Sub-task 2.2.1: Create Pin-to-Pin Wiring Diagrams.
           Action: Use a tool (like Fritzing, KiCad, or even a clear drawing tool) to create a diagram showing the exact pin connections for every wire.
           Example: "Raspberry Pi GPIO Pin 4 (5V)" connects to "Camera Module VCC Pin". "Flight Controller UART TX" connects to "Telemetry Module RX".
       Sub-task 2.2.2: Specify Wire Gauges and Lengths.
           Action: Create a table specifying the required wire gauge (e.g., 12 AWG for main power, 22 AWG for signals) and estimated length for each connection. This makes purchasing and preparation easier.
       Sub-task 2.2.3: Plan Physical Wire Routing.
           Action (Mohana & Arun): Collaborate using the CAD model to plan the physical paths for wires. This ensures clean wiring, prevents interference with propellers or sensors, and improves maintainability.
       Sub-task 2.2.4: Create a Power Budget.
           Action: Create a spreadsheet listing every power-consuming component. Find its maximum current draw from datasheets. Sum the total current draw to ensure your batteries and Power Module (PM02) can handle the load with a safe margin (e.g., 25-30% headroom).

---

### Sub-Phase 3: Procurement & Software Architecture (Parallel to Weeks 2-3)

Goal: To order all hardware while the detailed design is being finalized, and to create a detailed software development plan.

Task 3.1: Finalize Component Procurement
   Lead: Hitarthi Sharma
   Overseen by: Pranava Kumar
   Guidance: With the design finalized, you can confidently order parts.
       Sub-task 3.1.1: Verify Suppliers & Place Orders.
           Action: Double-check suppliers for stock and lead times. Place all orders for components identified in the finalized BOM.
       Sub-task 3.1.2: Create & Maintain a Tracking Sheet.
           Action: Use a shared spreadsheet to track every order: item, supplier, order number, cost, estimated delivery date, and received status. This is crucial for project management.

Task 3.2: Detailed Software Architecture & Module Planning
   Lead: Dinesh Kumar
   Involves: Pranava Kumar
   Guidance: This is what the software team does while waiting for hardware to arrive. Plan the code in detail so that when the drones are built, you can start implementing immediately.
       Sub-task 3.2.1: Flight Controller Setup Plan.
           Action: Create a checklist of every parameter that needs to be configured in Mission Planner/QGroundControl for both flight controllers (e.g., frame type, sensor calibration steps, fail-safe values, flight mode setup, RTK GPS configuration).
       Sub-task 3.2.2: Companion Computer (Pi) Software Plan.
           Action: Define the specific Python scripts and functions needed.
           Example:
               `main_vision.py`: Main loop to orchestrate other modules.
               `camera_handler.py`: A class to initialize the IMX219 camera and capture frames.
               `crop_detector.py`: A class containing the OpenCV logic to identify stress signatures.
               `mavlink_communicator.py`: A class to handle sending/receiving MAVLink messages to/from the flight controller and GCS.
       Sub-task 3.2.3: Ground Station (GCS) UI/UX Mockup.
           Action: Sketch the layout of your custom GCS interface. Where does the video feed go? How are geotagged points displayed? What buttons are needed (e.g., "Start Scan," "Return to Home")? This will make the actual UI development much faster.
