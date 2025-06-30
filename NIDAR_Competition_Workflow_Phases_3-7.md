NIDAR Competition: Detailed Workflow for Phase 3 - Prototyping & Assembly


  Overall Objective: To translate the detailed digital designs (CAD models and electrical schematics) into two fully assembled, physical drones, ready for power-up and software configuration. This phase is about precision craftsmanship and careful integration.


  Key Deliverables:
    One fully assembled "Spraying Drone" (EFT E610P frame).
    One fully assembled "Scout Drone" (ZD850 frame).
    All wiring completed, secured, and ready for initial power checks.
    A log of the build process, noting any physical modifications or challenges encountered.

  ---

  Sub-Phase 3.1: Mechanical Assembly & Integration


  Goal: To build the core physical structure of both drones and mount all mechanical and major electronic components.


  Task 3.1.1: Frame & Propulsion System Assembly
    Lead: Arun Kumar (Robotics)
    Involves: Mohana Divya (ECE)
    Guidance: Work methodically on one drone at a time to avoid mixing parts. Use thread locker (e.g., Loctite Blue) on all motor and frame screws to prevent them from loosening due to vibration.
        Sub-task 3.1.1.1: Assemble the Main Frames.
            Action (Arun): Carefully assemble the ZD850 (Scout) and EFT E610P (Spraying) frames according to their manuals. Ensure all screws are tightened correctly but not over-torqued to avoid stripping threads.
        Sub-task 3.1.1.2: Mount Motors and ESCs.
            Action (Arun): Mount the 6 Hobbywing XRotor X6 Plus combo kits on the EFT E610P. Mount the 6 Tarot TL2955 4008MT motors on the ZD850. Keep the 2 spare units for each safely stored. Install the TAROT 1655 Foldable Propellers on the Scout drone motors.
        Sub-task 3.1.1.3: Install Landing Gear.
            Action (Arun): Securely attach the landing gear to both frames. Test for stability on a level surface.


  Task 3.1.2: Payload & Major Component Integration
    Lead: Arun Kumar (Robotics)
    Involves: Mohana Divya (ECE), Hitarthi Sharma (Biotechnology, for minor assistance)
    Guidance: This step is critical for achieving the correct Center of Gravity (CG) as planned in the CAD model.
        Sub-task 3.1.2.1: Mount Flight Controllers and Companion Computers.
            Action (Arun): Mount the Jiyi K++ V2 (Spraying Drone) and the Hex Pixhawk Cube+ (Scout Drone) onto their designated platforms using the
             specified vibration dampeners. This is crucial for clean sensor readings. Mount the Raspberry Pi 5 units in their fan-equipped cases.
        Sub-task 3.1.2.2: Mount Sensor & Camera Systems.
            Action (Arun): Mount the HEX Here4 RTK module on a mast for a clear sky view. Mount the SIYI A8 mini gimbal camera on the Scout Drone. Mount
             the Jiyi Water Flow Sensor on the Spraying Drone.

  ---

  Sub-Phase 3.2: Electrical Integration & Wiring


  Goal: To safely and reliably connect all electronic components, following the detailed schematics to create a functional power and data network.


  Task 3.2.1: Power System Wiring
    Lead: Mohana Divya (ECE)
    Involves: Arun Kumar (Robotics)
    Guidance: SAFETY FIRST. Work in a clean, well-lit area. Before connecting the main battery for the first time, use a multimeter to check for short
     circuits across the main power leads. Consider using a "smoke stopper" device for the very first power-up.
        Sub-task 3.2.1.1: Install and Solder the PDB.
            Action (Mohana): Mount the Power Distribution Board (PDB) at the center of each drone. Solder the main battery leads (with XT60 connector) to
             the PDB's main input.
        Sub-task 3.2.1.2: Connect ESCs to PDB.
            Action (Mohana): Cut the ESC power wires to the correct length and solder them to the PDB's motor outputs. Ensure correct polarity (+ to +, -
             to -) for every ESC.
        Sub-task 3.2.1.3: Connect the Power Module.
            Action (Mohana): Wire the Holybro PM02 between the battery and the PDB/Flight Controller according to the schematic. This ensures the flight
             controller receives clean power and can monitor battery voltage/current.


  Task 3.2.2: Signal and Data Wiring
    Lead: Mohana Divya (ECE)
    Involves: Dinesh Kumar (CSE, for consultation)
    Guidance: Keep signal wires as far away from main power wires as possible to reduce electrical noise. Twist servo/signal wires where possible.
        Sub-task 3.2.2.1: Connect ESCs to Flight Controller.
            Action (Mohana): Connect the signal wires from each ESC to the correct motor output pins on the flight controller.
        Sub-task 3.2.2.2: Connect All Peripherals.
            Action (Mohana): Following the pin-to-pin diagram, connect the GPS, telemetry radio, RC receiver, camera, and any other sensors to the
             appropriate UART, I2C, or CAN ports on the flight controller and Raspberry Pi.
        Sub-task 3.2.2.3: Wire Management.
            Action (Mohana, Arun): Neatly route and secure all wires using zip ties and braided sleeving. This improves reliability, airflow for cooling,
             and makes maintenance easier. Ensure no wires can come into contact with spinning propellers.


  Task 3.2.3: Final Assembly & Pre-Flight Checks
    Lead: Pranava Kumar (as Integrator)
    Involves: All Team Members
    Guidance: This is the final step before the drones move to the software and testing phase.
        Sub-task 3.2.3.1: Install Propellers.
            Action (Arun): IMPORTANT: Install propellers last, only after all power system checks and software configurations that involve motor spinning
             are complete. Ensure correct CW and CCW propellers are on the corresponding motors.
        Sub-task 3.2.3.2: Final Weight and Balance Check.
            Action (Arun): With everything assembled, perform a final physical check of the Center of Gravity.
        Sub-task 3.2.3.3: Create a Build Log.
            Action (Hitarthi): Document the entire assembly process with photos. Note any deviations from the original design, challenges faced, and
             solutions implemented. This is invaluable for the final report.

  ---
  ---

  NIDAR Competition: Detailed Workflow for Phase 4 - Software Development & Integration


  Overall Objective: To breathe life into the assembled hardware by configuring firmware, developing custom software, and establishing robust
  communication links, transforming the physical drones into intelligent, mission-capable systems.


  Key Deliverables:
    Flight controllers flashed with fully calibrated and configured firmware.
    A functional Ground Control Station (GCS) capable of mission planning, control, and real-time data display.
    Working computer vision scripts on the Raspberry Pi for crop stress detection and geotagging.
    A stable, two-way communication link between the drones and the GCS.

  ---

  Sub-Phase 4.1: Core Flight System Configuration

  Goal: To establish stable, baseline control over the drones. This is the foundation of flight.


  Task 4.1.1: Firmware Flashing and Initial Setup
    Lead: Dinesh Kumar (CSE)
    Involves: Pranava Kumar, Mohana Divya (ECE)
    Guidance: Use a USB connection for this stage. PROPELLERS MUST BE OFF.
        Sub-task 4.1.1.1: Flash Firmware.
            Action (Dinesh): Connect the Cube Orange+ and KK++ v2 flight controllers to the GCS computer. Use Mission Planner (or QGroundControl) to flash
             the latest stable version of the ArduPilot firmware for the appropriate frame type (Hexacopter).
        Sub-task 4.1.1.2: Perform Mandatory Hardware Calibration.
            Action (Dinesh, Mohana): Follow the GCS setup wizard to perform the initial calibrations:
                Accelerometer Calibration: A multi-step process requiring you to place the drone on each of its axes.
                Compass Calibration: Involves rotating the drone through all axes to map the local magnetic field. Do this away from large metal objects.
                Radio Control Calibration: Calibrate the Skydroid T12 RC sticks to define their min, max, and center points.
        Sub-task 4.1.1.3: Configure Airframe and Motor Layout.
            Action (Dinesh): In the firmware parameters, select the correct frame type (Hexa-X, Hexa-+) and verify that the motor test sequence in the GCS
             spins the correct motor as per the diagram.


  Task 4.1.2: Safety & Flight Mode Configuration
    Lead: Dinesh Kumar (CSE)
    Involves: Pranava Kumar
    Guidance: These are the most important parameters to set before any outdoor testing.
        Sub-task 4.1.2.1: Configure Failsafes.
            Action (Dinesh): Set up the battery failsafe (voltage level and action, e.g., Return-to-Launch). Set up the radio failsafe (what the drone does
             if it loses signal, e.g., Return-to-Launch).
        Sub-task 4.1.2.2: Set Up Geofence.
            Action (Dinesh): Configure a simple circular geofence with a maximum altitude and radius around the home point as required by the NIDAR rules.
        Sub-task 4.1.2.3: Assign Flight Modes.
            Action (Dinesh): Map switches on your Skydroid T12 RC to essential flight modes:
                Stabilize: For manual control.
                Altitude Hold: For easier manual flight.
                Loiter: GPS-hold position, crucial for testing.
                Auto: For executing pre-planned missions.
                Return-to-Launch (RTL): Your primary safety switch.

  ---

  Sub-Phase 4.2: Application & GCS Software Development


  Goal: To develop the custom software that will execute the mission's intelligent tasks.


  Task 4.2.1: Companion Computer (Raspberry Pi) Software
    Lead: Dinesh Kumar (CSE)
    Involves: Pranava Kumar, Hitarthi Sharma (for research input)
    Guidance: Develop and test these scripts on the bench before integrating them on the flying drone. Use sample images and simulated data.
        Sub-task 4.2.1.1: Develop Vision Processing Script.
            Action (Dinesh): Using OpenCV in Python, write a script that:
               1. Captures the video stream from the IMX219 camera.
               2. Converts frames to a suitable color space (like HSV, which is great for color detection).
               3. Filters the image based on the color ranges for "stressed crops" identified by Hitarthi.
               4. Identifies contours/blobs of the target color.
        Sub-task 4.2.1.2: Implement MAVLink Communication.
            Action (Dinesh, Pranava): Use a library like pymavlink to establish a connection between the Raspberry Pi and the flight controller via a
             serial port (UART). Write functions to request data (like current GPS coordinates) from the flight controller.
        Sub-task 4.2.1.3: Integrate Geotagging Logic.
            Action (Dinesh, Pranava): Combine the previous two sub-tasks. When the vision script detects a stressed crop, the MAVLink script should
             immediately request the drone's current RTK-corrected position and then package this data (e.g., as a JSON object with lat, lon, and a
             timestamp) to be sent to the GCS.


  Task 4.2.2: Ground Control Station (GCS) Implementation
    Lead: Pranava Kumar
    Involves: Dinesh Kumar
    Guidance: Build upon the UI/UX mockups. The goal is a clear, uncluttered interface that gives the operator full situational awareness.
        Sub-task 4.2.2.1: Implement Mission Planning Interface.
            Action (Dinesh): Ensure the GCS can load the KML file provided by the organizers and generate a flight path (waypoint mission) for the drone to
             follow.
        Sub-task 4.2.2.2: Develop the Live Data Dashboard.
            Action (Pranava, Dinesh): Create the main GCS view. This should include:
                A map display showing the real-time position of both drones.
                A live video feed from the Scout Drone.
                Key telemetry data (altitude, speed, battery voltage, distance from home).
        Sub-task 4.2.2.3: Implement Geotag Visualization.
            Action (Dinesh): Write the code to receive the "Stressed Plant Found" packets from the drone and automatically place a visual marker (a pin or
             a colored dot) at the received coordinates on the GCS map.

  ---


  Sub-Phase 4.3: Full System Communication Integration

  Goal: To ensure all parts of the system can talk to each other reliably.


  Task 4.3.1: Establish Drone-to-GCS Link
    Lead: Mohana Divya (ECE)
    Involves: Dinesh Kumar
    Guidance: This is the final integration step of this phase.
        Sub-task 4.3.1.1: Configure Telemetry Radios.
            Action (Mohana): Connect the Holybro SiK radios to the flight controller and the GCS computer. Use the GCS software to ensure they have
             matching Net IDs and are communicating correctly.
        Sub-task 4.3.1.2: End-to-End Data Test.
            Action (All): With the drone assembled and powered on (PROPS OFF), run a full system test.
               1. Verify the GCS is receiving telemetry from the flight controller.
               2. Point the drone's camera at a test image of a "stressed plant."
               3. Confirm that a new pin appears on the GCS map at the drone's current (bench) location. This validates the entire software pipeline.

  ---
  ---

  NIDAR Competition: Detailed Workflow for Phase 5 - Testing & Refinement


  Overall Objective: To systematically and safely test every component and software function, identify and resolve all issues, and iteratively tune the
  drones' performance to be robust, reliable, and optimized for the competition mission. This is an iterative cycle: Test -> Analyze -> Fix -> Retest.


  Key Deliverables:
    Two fully flight-tested and stable drones.
    A complete log of all tests performed, including parameters, outcomes, and issues resolved.
    Optimized PID tuning parameters for stable flight in various conditions.
    Validated performance of all mission-critical subsystems (RTK, spraying, computer vision).

  ---

  Sub-Phase 5.1: Bench & Safety Testing (Pre-Flight)


  Goal: To verify all systems are functioning correctly in a controlled, safe environment before attempting to fly. PROPELLERS MUST BE OFF for all tests
  unless specified.


  Task 5.1.1: Full System Power & Communication Test
    Lead: Mohana Divya (ECE)
    Involves: Dinesh Kumar, Arun Kumar
    Guidance: This is a final check of the work from Phase 3 and 4.
        Sub-task 5.1.1.1: Extended Power-On Test.
            Action (Mohana): Leave both drones powered on (on the bench) for an extended period (e.g., 30 minutes). Monitor the temperature of the ESCs,
             motors, and Raspberry Pi. Ensure the Pi's fan is working and there is no overheating.
        Sub-task 5.1.1.2: Communication Link Integrity Check.
            Action (Dinesh): Verify that the telemetry and RC control links are stable and do not drop out. Walk around the drone with the GCS and RC
             transmitter to check for any dead spots in close proximity.


  Task 5.1.2: Motor & Propulsion System Verification
    Lead: Arun Kumar (Robotics)
    Involves: Mohana Divya
    Guidance: Secure the drone firmly to the bench.
        Sub-task 5.1.2.1: Motor Order & Direction Test.
            Action (Arun, Dinesh): Using the motor test feature in Mission Planner, test each motor one by one to confirm it spins in the correct direction
             (CW/CCW) and corresponds to the correct output on the flight controller.
        Sub-task 5.1.2.2: Throttle Response Test (PROPS ON - DANGER).
            Action (Arun): EXTREME CAUTION. Secure the drone very firmly to a heavy, stable workbench or the ground. With propellers on, slowly and briefly
             increase the throttle to ensure all motors spin up smoothly together. This is a check for major vibrations or ESC issues, not a full power test.



  Task 5.1.3: Failsafe Functionality Test
    Lead: Dinesh Kumar (CSE)
    Involves: Pranava Kumar
    Guidance: This is one of the most important pre-flight safety checks.
        Sub-task 5.1.3.1: Radio Failsafe Test.
            Action (Dinesh): With the drone armed on the bench (PROPS OFF), turn off the Skydroid T12 RC transmitter. Verify that the GCS shows a "Radio
             Failsafe" warning and the flight mode switches to RTL (or your configured action).
        Sub-task 5.1.3.2: Geofence Breach Test.
            Action (Dinesh): While connected to the GCS, physically lift and move the drone to simulate it crossing the geofence boundary on the map.
             Verify the drone enters the configured failsafe mode.

  ---


  Sub-Phase 5.2: Initial Flight Testing & PID Tuning

  Goal: To achieve stable, predictable, and responsive flight characteristics for both drones.


  Task 5.2.1: First Hover Test
    Lead: Arun Kumar (as Pilot/Safety Officer)
    Involves: Dinesh Kumar (as GCS Operator), Mohana Divya (as Systems Monitor)
    Guidance: Conduct this in a large, open area, free of obstacles and people. Have a fire extinguisher and first-aid kit nearby.
        Sub-task 5.2.1.1: Short, Low-Altitude Hover.
            Action (Arun): In Stabilize mode, apply a small amount of throttle to get the drone light on its skids. Check for any unusual sounds or
             vibrations. If all is well, gently lift off to a 1-2 meter hover.
        Sub-task 5.2.1.2: Initial Control Response Check.
            Action (Arun): Make very small, gentle inputs on the roll, pitch, and yaw sticks. The drone should respond smoothly. If it feels overly twitchy
             or sluggish, land immediately.
        Sub-task 5.2.1.3: Test Altitude Hold & Loiter.
            Action (Arun, Dinesh): Once a stable hover is achieved, switch to Altitude Hold. The drone should maintain its altitude. Then, switch to
             Loiter. The drone should hold its position against any light wind.


  Task 5.2.2: PID Tuning
    Lead: Dinesh Kumar (CSE)
    Involves: Arun Kumar, Pranava Kumar
    Guidance: This is an iterative process to make the drone fly well. The goal is to eliminate oscillations (shaking) and have a "locked-in" feel.
        Sub-task 5.2.2.1: Analyze Flight Logs.
            Action (Dinesh): After each flight, download the .bin logs from the flight controller. Use the GCS log viewer to compare the desired roll/pitch
             angles with the actual roll/pitch angles. Oscillations will be clearly visible.
        Sub-task 5.2.2.2: Iterative PID Adjustments.
            Action (Dinesh): Follow the ArduPilot tuning guide. Start by tuning the Rate P and D gains for roll and pitch to stop oscillations. Then tune
             the Stabilize P gains to adjust responsiveness. Make small changes, then fly, then analyze the logs again. Repeat until the drone is stable.

  ---


  Sub-Phase 5.3: Mission Subsystem Validation

  Goal: To test and validate the performance of each specific mission-related component in a real-world flight scenario.


  Task 5.3.1: Scout Drone Sensor Validation
    Lead: Pranava Kumar
    Involves: Dinesh Kumar, Arun Kumar
    Guidance: Perform these tests in a controlled area where you can place known targets.
        Sub-task 5.3.1.1: RTK Accuracy Test.
            Action (Dinesh): Place a clearly marked object on the ground and record its precise GPS coordinates using the RTK Base Station. Fly the Scout
             Drone over the object, hover, and have the GCS record the drone's reported RTK position. Compare the two coordinates to validate your accuracy.
        Sub-task 5.3.1.2: Live Computer Vision Test.
            Action (Dinesh, Arun): Place test targets (e.g., yellow-colored boards) on the ground. Fly the Scout Drone over them and verify that the vision
             system correctly identifies them and that geotagged pins appear on the GCS map in the correct locations.
        Sub-task 5.3.1.3: Obstacle Avoidance Test.
            Action (Arun, Dinesh): In a safe, open area, fly the drone slowly towards a large, soft obstacle (like a large cardboard box). Verify that the
             drone stops or executes its programmed avoidance maneuver.


  Task 5.3.2: Spraying Drone System Validation
    Lead: Arun Kumar (Robotics)
    Involves: Mohana Divya
    Guidance: Use water for all initial tests, not the colored liquid for the competition.
        Sub-task 5.3.2.1: In-Flight Spraying Test.
            Action (Arun): Fly the Spraying Drone to a safe location and activate the spraying system. Verify that the pump works, the nozzles produce the
             correct pattern, and there are no leaks.
        Sub-task 5.3.2.2: Flow Rate Sensor Calibration.
            Action (Mohana): Spray a known volume of water (e.g., 1 liter) and compare it to the volume reported by the waterflow sensor via telemetry.
             Calibrate the sensor's parameters in the flight controller firmware if necessary.

  ---

  Sub-Phase 5.4: Full Autonomous Mission Rehearsal


  Goal: To simulate the entire competition mission from start to finish to identify any issues in the workflow, software logic, or hardware integration.


  Task 5.4.1: End-to-End Mission Simulation
    Lead: Pranava Kumar
    Involves: All Team Members
    Guidance: This is your dress rehearsal. Treat it exactly like the final competition run.
        Sub-task 5.4.1.1: Execute the Full Mission.
            Action (All): Set up the GCS and drones. Upload the KML mission file. Initiate the autonomous takeoff and scanning mission for the Scout Drone.
             Let it detect test targets and send geotags to the GCS. Then, use those coordinates to plan and execute a spraying mission for the Spraying
             Drone.
        Sub-task 5.4.1.2: Identify Bottlenecks and Refine Logic.
            Action (All): Did the transition between scouting and spraying work smoothly? Was the data transfer reliable? Was the GCS interface clear and
             easy to use under pressure? Document all issues and refine the software logic and operational procedures accordingly. Repeat this full
             rehearsal multiple times until it is smooth and reliable.

  ---
  ---


  NIDAR Competition: Detailed Workflow for Phase 6 - Documentation & Presentation Preparation

  Overall Objective: To synthesize all the technical work, research, and testing data into polished, professional, and compelling documentation and
  presentations that meet all NIDAR requirements and effectively showcase the team's innovation and hard work.


  Key Deliverables:
    A complete and persuasive Technical Review presentation (PDF/PPT).
    A professional Business Strategy Pitch deck (PDF/PPT).
    A detailed and accurate final Cost Sheet.
    A comprehensive Project Documentation package for submission/review.

  ---


  Sub-Phase 6.1: Content Creation & Collation

  Goal: To gather and structure all the necessary information for the final deliverables.


  Task 6.1.1: Technical Presentation Content Development
    Lead: Pranava Kumar (as Integrator)
    Involves: Arun Kumar, Mohana Divya, Dinesh Kumar
    Guidance: Structure the presentation logically, following the topics listed in the NIDAR rulebook (7.5). Use high-quality visuals (CAD renderings,
     photos of the drones, diagrams, test footage).
        Sub-task 6.1.1.1: Design & Mechanical Sections.
            Action (Arun): Prepare slides covering the design process, component selection rationale, final 3D CAD views, and key mechanical features
             (e.g., folding mechanism, payload integration).
        Sub-task 6.1.1.2: Electrical & Systems Sections.
            Action (Mohana): Prepare slides detailing the electrical system architecture, power budget, sensor integration, and communication links.
        Sub-task 6.1.1.3: Software & Autonomy Sections.
            Action (Dinesh): Prepare slides explaining the software architecture, the multi-drone control approach from a single GCS, the computer vision
             algorithms, and the path planning/autonomy logic.
        Sub-task 6.1.1.4: Safety & Operations Sections.
            Action (Pranava): Prepare slides on the implemented safety features (failsafes, geofence, RTH) and the operational workflow for the mission.


  Task 6.1.2: Business Strategy Pitch Development
    Lead: Pranava Kumar
    Involves: Hitarthi Sharma
    Guidance: Think beyond the competition. Frame your project as a viable startup concept.
        Sub-task 6.1.2.1: Market Research & Problem Definition.
            Action (Hitarthi): Research the current market for agricultural drones. Identify the key pain points for farmers that your "AgriSync-X" system
             solves. Gather statistics on market size and potential customers.
        Sub-task 6.1.2.2: Develop the Value Proposition.
            Action (Pranava): Clearly articulate what makes your dual-drone system unique and valuable. Focus on benefits like increased efficiency,
             reduced costs, and improved crop yields.
        Sub-task 6.1.2.3: Create the Pitch Deck.
            Action (Pranava, Hitarthi): Create a compelling presentation covering all the topics in the rulebook (7.10), including an overview of the
             product, market need, potential customers, cost/pricing strategy, and future vision.


  Task 6.1.3: Documentation & Cost Sheet Finalization
    Lead: Hitarthi Sharma
    Involves: Pranava Kumar
    Guidance: Accuracy and completeness are key.
        Sub-task 6.1.3.1: Compile Final Cost Sheet.
            Action (Hitarthi): Using the procurement tracking sheet, create a final, itemized cost sheet that includes every single component, material,
             and shipping cost.
        Sub-task 6.1.3.2: Collate All Project Documentation.
            Action (Hitarthi): Gather all design documents, schematics, build logs, test logs, and software plans into a single, well-organized project
             folder. Create a table of contents and ensure all documents are clearly labeled. This will be your master technical deliverable.

  ---

  Sub-Phase 6.2: Review, Refinement & Rehearsal

  Goal: To polish all deliverables to a professional standard and ensure the team is confident and prepared for the presentation phase.


  Task 6.2.1: Internal Review & Feedback
    Lead: Pranava Kumar
    Involves: All Team Members
    Guidance: Be critical and provide constructive feedback to each other.
        Sub-task 6.2.1.1: Presentation Peer Review.
            Action (All): The entire team should review the draft presentations. Check for clarity, accuracy, and flow. Does it tell a compelling story? Is
             it easy to understand?
        Sub-task 6.2.1.2: Documentation Cross-Check.
            Action (Arun, Mohana, Dinesh): Review Hitarthi's compiled documentation to ensure the technical details for your respective domains are
             accurate and complete.


  Task 6.2.2: Presentation Rehearsal
    Lead: Pranava Kumar
    Involves: All Presenting Members
    Guidance: Practice is the key to a smooth and confident delivery.
        Sub-task 6.2.2.1: Timed Run-Throughs.
            Action (Pranava): Conduct multiple full rehearsals of both presentations. Use a timer to ensure you stay within the 15-minute time limit,
             leaving ample time for the Q&A session.
        Sub-task 6.2.2.2: Mock Q&A Session.
            Action (All): Have non-presenting team members (and perhaps your faculty advisor) act as the jury. Ask tough questions about the design,
             business plan, and potential weaknesses. This will prepare the presenters for the real Q&A.
        Sub-task 6.2.2.3: Final Polish.
            Action (Pranava): Based on rehearsals and feedback, make final edits to the slides for visual appeal and clarity.


  ---
  ---

  NIDAR Competition: Detailed Workflow for Phase 7 - Final Competition Execution

  Overall Objective: To execute the competition plan with precision, professionalism, and composure, successfully passing all technical inspections and
  performing the mission to the best of the drones' capabilities.


  Key Deliverables:
    A "Pass" on the Pre-Flight Inspection.
    A successfully executed Final Mission flight.
    All required data and logs ready for submission to the judges.

  ---

  Sub-Phase 7.1: Pre-Competition Preparation (Week Before)


  Goal: To ensure all hardware, software, and team members are 100% ready for competition day.


  Task 7.1.1: Create the Master Checklist
    Lead: Pranava Kumar
    Involves: All Team Members
    Guidance: This is the single most important document for competition day. Leave nothing to memory.
        Sub-task 7.1.1.1: Develop the Packing List.
            Action (All): Contribute to a shared list of every single item to bring.
            Categories: Drones (Scout, Sprayer), GCS (Laptop, mk32, antennas), Batteries (fully charged), Charger, Tools (screwdrivers, soldering iron,
             multimeter), Spares (props, screws, wires), Safety Gear (fire extinguisher, first aid), Documentation (presentations on a USB drive, printed
             rulebook).
        Sub-task 7.1.1.2: Develop the On-Site Procedure Checklist.
            Action (Pranava, Dinesh, Arun): Create a step-by-step list of actions for setting up your station, performing pre-flight checks, and executing
             the mission. This reduces stress and prevents mistakes on the day.


  Task 7.1.2: Final System Freeze & Prep
    Lead: Pranava Kumar
    Involves: All Team Members
    Guidance: Avoid making any last-minute, untested changes to the hardware or software.
        Sub-task 7.1.2.1: Software Freeze.
            Action (Dinesh): Finalize the software versions. Back up all code and GCS configurations to multiple locations (cloud, USB drives).
        Sub-task 7.1.2.2: Hardware Check & Pack.
            Action (Arun, Mohana): Perform a final mechanical and electrical inspection of both drones. Check all solder joints and screw tightness.
             Carefully pack the drones and all equipment using the master checklist.
        Sub-task 7.1.2.3: Battery Charging Cycle.
            Action (Mohana): Fully charge all flight batteries and the GCS battery the day before the competition. Label them clearly.

  ---


  Sub-Phase 7.2: Competition Day Execution

  Goal: To remain calm, focused, and methodical, following the plan to achieve a successful outcome.


  Task 7.2.1: Setup & Pre-Flight Inspection
    Lead: Pranava Kumar (as Coordinator)
    Guidance: Arrive early. Find your designated area. Work calmly through your procedure checklist.
        Sub-task 7.2.1.1: Station Setup.
            Action (All): Set up your GCS tables, power up the computers, and lay out all your tools and equipment in an organized manner.
        Sub-task 7.2.1.2: Drone Assembly & System Checks.
            Action (Arun, Mohana): Carefully assemble the drones. Power them on and connect to the GCS.
        Sub-task 7.2.1.3: Final Sensor Calibration.
            Action (Dinesh): Perform a final compass calibration on-site, as the local magnetic field will be different. Verify all sensors are providing
             good data.
        Sub-task 7.2.1.4: Present for Pre-Flight Inspection.
            Action (Pranava, Arun, Dinesh): When called, present your drones to the Flight Inspector. Be prepared to demonstrate all safety features
             (failsafes, RTH) and answer any questions confidently.


  Task 7.2.2: Final Mission Execution
    Lead: Pranava Kumar (as Mission Director)
    Guidance: This is the performance. Trust your preparation and your checklists. Communicate clearly and concisely within the team.
        Sub-task 7.2.2.1: Define Clear Roles.
            Action (Pranava): Re-confirm the roles for the mission:
                Dinesh (GCS Operator): Manages the GCS, loads the mission, monitors data, and is the primary operator for autonomous flight.
                Arun (Pilot / Safety Officer): Holds the Skydroid RC transmitter, ready to take manual control instantly if needed. Manages the physical
                 drone on the launchpad.
                Mohana (Systems Monitor): Watches the physical drones and listens for any unusual sounds. Monitors battery levels and system health on a
                 secondary screen if available.
                Pranava (Mission Director): Coordinates the team, makes the final call to launch, and communicates with the judges. Does not touch the
                 controls.
        Sub-task 7.2.2.2: Execute the Mission.
            Action (All): Follow your pre-planned mission procedure. Launch the Scout drone, perform the scan, and land. Analyze the data, plan the
             spraying mission, and execute it with the Spraying Drone.
        Sub-task 7.2.2.3: Data Management.
            Action (Dinesh, Hitarthi): After the flight, immediately save all flight logs from the flight controllers and the GCS.


  Task 7.2.3: Post-Mission & Debrief
    Lead: Pranava Kumar
    Involves: All Team Members
    Guidance: Regardless of the outcome, maintain professionalism.
        Sub-task 7.2.3.1: Secure Equipment.
            Action (All): Safely power down the drones, disconnect batteries, and pack up your station.
        Sub-task 7.2.3.2: Team Debrief.
            Action (All): Briefly discuss what went well and what could be improved. Acknowledge the hard work and effort of every team member. Celebrate
             the accomplishment of competing.