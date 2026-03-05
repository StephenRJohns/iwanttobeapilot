#!/usr/bin/env node
/**
 * Download and parse any FAA knowledge test question bank.
 * Outputs src/data/{code-lowercase}-questions.ts
 *
 * Usage:
 *   node scripts/download-test-bank.mjs PAR        # single bank
 *   node scripts/download-test-bank.mjs PAR IRA    # multiple banks
 *   node scripts/download-test-bank.mjs --all      # all 11 banks
 *
 * The FAA publishes each test question bank as a ZIP file containing
 * an RTF document. This script downloads, extracts, parses, and outputs
 * structured TypeScript data.
 */

import https from "https";
import http from "http";
import { createWriteStream, mkdirSync, readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ===========================================================================
// BANK_CONFIG — per-bank settings
// ===========================================================================

const BANK_CONFIG = {
  SPG: {
    code: "SPG",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/SPG.zip",
    outputFile: "src/data/spg-questions.ts",
    prefix: "SPG",
    aoks: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Performance and Limitations",
      "Principles of Flight",
      "Flight Instruments",
      "Aeromedical Factors",
    ],
    sampleQuestions: [
      { id: "SPG0001", aok: "Regulations", text: "What is the minimum age requirement for a sport pilot certificate?", choices: [{ key: "A", text: "14 years" }, { key: "B", text: "16 years" }, { key: "C", text: "17 years" }], correct: "C" },
      { id: "SPG0002", aok: "Regulations", text: "A sport pilot may act as pilot in command of a light-sport aircraft during which conditions?", choices: [{ key: "A", text: "Day VFR only unless endorsed for night" }, { key: "B", text: "Day and night VFR" }, { key: "C", text: "Day VFR only" }], correct: "C" },
      { id: "SPG0003", aok: "Regulations", text: "What maximum altitude may a sport pilot fly without additional endorsement?", choices: [{ key: "A", text: "10,000 feet MSL or 2,000 feet AGL, whichever is higher" }, { key: "B", text: "18,000 feet MSL" }, { key: "C", text: "14,500 feet MSL" }], correct: "A" },
      { id: "SPG0101", aok: "National Airspace System", text: "What class of airspace may a sport pilot NOT enter without additional training?", choices: [{ key: "A", text: "Class G" }, { key: "B", text: "Class B, C, or D" }, { key: "C", text: "Class E" }], correct: "B" },
      { id: "SPG0102", aok: "National Airspace System", text: "What equipment is required for flight in Class E airspace?", choices: [{ key: "A", text: "Two-way radio and transponder" }, { key: "B", text: "Mode C transponder above 10,000 feet MSL" }, { key: "C", text: "No special equipment for VFR below 10,000 feet MSL" }], correct: "C" },
      { id: "SPG0201", aok: "Weather", text: "What type of weather is associated with stable air masses?", choices: [{ key: "A", text: "Thunderstorms and turbulence" }, { key: "B", text: "Continuous precipitation, smooth air, and low stratus clouds" }, { key: "C", text: "Clear skies with gusty surface winds" }], correct: "B" },
      { id: "SPG0202", aok: "Weather", text: "What is the primary source of aviation weather information for preflight planning?", choices: [{ key: "A", text: "Television news weather reports" }, { key: "B", text: "Flight Service Station (FSS) or aviationweather.gov" }, { key: "C", text: "The aircraft's onboard weather radar" }], correct: "B" },
      { id: "SPG0301", aok: "Performance and Limitations", text: "What effect does high density altitude have on a glider's performance?", choices: [{ key: "A", text: "Improved climb rate and shorter takeoff roll" }, { key: "B", text: "Reduced lift and degraded climb performance" }, { key: "C", text: "No effect on unpowered aircraft" }], correct: "B" },
      { id: "SPG0302", aok: "Performance and Limitations", text: "What is the maximum gross weight for a light-sport glider?", choices: [{ key: "A", text: "1,320 pounds" }, { key: "B", text: "1,232 pounds (560 kg)" }, { key: "C", text: "600 pounds" }], correct: "A" },
      { id: "SPG0401", aok: "Principles of Flight", text: "What force keeps a glider flying after tow release?", choices: [{ key: "A", text: "Engine thrust" }, { key: "B", text: "Gravity component converting altitude into airspeed" }, { key: "C", text: "Lift alone without any forward energy" }], correct: "B" },
      { id: "SPG0402", aok: "Principles of Flight", text: "What is the primary effect of increasing angle of attack beyond the critical angle?", choices: [{ key: "A", text: "Lift increases indefinitely" }, { key: "B", text: "The wing stalls and lift decreases sharply" }, { key: "C", text: "Drag decreases" }], correct: "B" },
      { id: "SPG0501", aok: "Flight Instruments", text: "What instrument indicates the aircraft's altitude above sea level?", choices: [{ key: "A", text: "Vertical speed indicator" }, { key: "B", text: "Altimeter" }, { key: "C", text: "Airspeed indicator" }], correct: "B" },
      { id: "SPG0502", aok: "Flight Instruments", text: "What does the variometer (vertical speed indicator) show in a glider?", choices: [{ key: "A", text: "Groundspeed" }, { key: "B", text: "Rate of climb or descent" }, { key: "C", text: "Altitude above ground" }], correct: "B" },
      { id: "SPG0601", aok: "Aeromedical Factors", text: "What is the most effective method for scanning for traffic?", choices: [{ key: "A", text: "Continuous sweeping scan" }, { key: "B", text: "Systematic sector-by-sector scan with brief pauses" }, { key: "C", text: "Focusing on one direction at a time for 30 seconds" }], correct: "B" },
      { id: "SPG0602", aok: "Aeromedical Factors", text: "At what altitude does hypoxia begin to significantly affect pilot performance?", choices: [{ key: "A", text: "5,000 feet MSL at night" }, { key: "B", text: "10,000 feet MSL during the day" }, { key: "C", text: "Both A and B are correct" }], correct: "C" },
    ],
  },

  RPA: {
    code: "RPA",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/RPA.zip",
    outputFile: "src/data/rpa-questions.ts",
    prefix: "RPA",
    aoks: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
    ],
    sampleQuestions: [
      { id: "RPA0001", aok: "Regulations", text: "A recreational pilot may carry no more than how many passengers?", choices: [{ key: "A", text: "0" }, { key: "B", text: "1" }, { key: "C", text: "3" }], correct: "B" },
      { id: "RPA0002", aok: "Regulations", text: "A recreational pilot is limited to flights within what distance of the departure airport without additional training?", choices: [{ key: "A", text: "25 nautical miles" }, { key: "B", text: "50 nautical miles" }, { key: "C", text: "100 nautical miles" }], correct: "B" },
      { id: "RPA0003", aok: "Regulations", text: "What certificate does a recreational pilot need to fly at an airport with an operating control tower?", choices: [{ key: "A", text: "No additional endorsement needed" }, { key: "B", text: "A logbook endorsement from an authorized instructor" }, { key: "C", text: "A private pilot certificate" }], correct: "B" },
      { id: "RPA0101", aok: "National Airspace System", text: "What class of airspace requires ATC clearance to enter?", choices: [{ key: "A", text: "Class E" }, { key: "B", text: "Class G" }, { key: "C", text: "Class B" }], correct: "C" },
      { id: "RPA0102", aok: "National Airspace System", text: "A blue dashed line on a sectional chart represents what type of airspace?", choices: [{ key: "A", text: "Class B" }, { key: "B", text: "Class D" }, { key: "C", text: "Alert area" }], correct: "B" },
      { id: "RPA0201", aok: "Weather", text: "What type of front is typically associated with thunderstorm activity?", choices: [{ key: "A", text: "Warm front" }, { key: "B", text: "Cold front" }, { key: "C", text: "Stationary front" }], correct: "B" },
      { id: "RPA0202", aok: "Weather", text: "What does a TAF provide?", choices: [{ key: "A", text: "Actual current conditions at an airport" }, { key: "B", text: "A forecast of expected weather conditions at an airport" }, { key: "C", text: "Pilot reports of turbulence" }], correct: "B" },
      { id: "RPA0301", aok: "Performance and Limitations", text: "How does a headwind affect landing distance?", choices: [{ key: "A", text: "Increases landing distance" }, { key: "B", text: "Decreases landing distance" }, { key: "C", text: "Has no effect on landing distance" }], correct: "B" },
      { id: "RPA0302", aok: "Performance and Limitations", text: "What is pressure altitude?", choices: [{ key: "A", text: "Altitude above mean sea level" }, { key: "B", text: "The altitude indicated when the altimeter is set to 29.92 in. Hg" }, { key: "C", text: "Height above ground level" }], correct: "B" },
      { id: "RPA0401", aok: "Principles of Flight", text: "What are the four forces acting on an airplane in flight?", choices: [{ key: "A", text: "Lift, weight, thrust, and drag" }, { key: "B", text: "Lift, gravity, power, and friction" }, { key: "C", text: "Lift, mass, thrust, and resistance" }], correct: "A" },
      { id: "RPA0402", aok: "Principles of Flight", text: "An airplane stalls at the same angle of attack regardless of:", choices: [{ key: "A", text: "Weight" }, { key: "B", text: "Bank angle" }, { key: "C", text: "Airspeed" }], correct: "C" },
      { id: "RPA0501", aok: "Aircraft Systems", text: "What is the purpose of the mixture control?", choices: [{ key: "A", text: "To adjust the fuel/air ratio entering the engine" }, { key: "B", text: "To control the throttle setting" }, { key: "C", text: "To select the fuel tank" }], correct: "A" },
      { id: "RPA0502", aok: "Aircraft Systems", text: "What does a drop in RPM when checking magnetos indicate?", choices: [{ key: "A", text: "Both magnetos are working correctly" }, { key: "B", text: "One magneto is operating the engine; a small drop is normal" }, { key: "C", text: "The magneto system has failed" }], correct: "B" },
      { id: "RPA0601", aok: "Flight Instruments", text: "What three instruments use the pitot-static system?", choices: [{ key: "A", text: "Airspeed indicator, altimeter, and vertical speed indicator" }, { key: "B", text: "Attitude indicator, heading indicator, and turn coordinator" }, { key: "C", text: "Airspeed indicator, attitude indicator, and altimeter" }], correct: "A" },
      { id: "RPA0701", aok: "Aeromedical Factors", text: "What is the primary danger of scuba diving before flying?", choices: [{ key: "A", text: "Fatigue" }, { key: "B", text: "Decompression sickness from dissolved nitrogen" }, { key: "C", text: "Ear pain" }], correct: "B" },
      { id: "RPA0702", aok: "Aeromedical Factors", text: "The IMSAFE checklist stands for:", choices: [{ key: "A", text: "Illness, Medication, Stress, Alcohol, Fatigue, Emotion/Eating" }, { key: "B", text: "Instruments, Maps, Supplies, Alternator, Fuel, Engine" }, { key: "C", text: "IFR, METAR, SIGMET, AIRMET, Forecast, Enroute" }], correct: "A" },
    ],
  },

  PAR: {
    code: "PAR",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/PAR.zip",
    outputFile: "src/data/par-questions.ts",
    prefix: "PAR",
    aoks: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Cross-Country Flight Planning",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
    ],
    sampleQuestions: [
      { id: "PAR0001", aok: "Regulations", text: "What is the minimum safe altitude for flight over congested areas?", choices: [{ key: "A", text: "500 feet above the highest obstacle within a horizontal radius of 2,000 feet of the aircraft" }, { key: "B", text: "1,000 feet above the highest obstacle within a horizontal radius of 2,000 feet of the aircraft" }, { key: "C", text: "1,500 feet above the highest obstacle within a horizontal radius of 2,000 feet of the aircraft" }], correct: "B" },
      { id: "PAR0002", aok: "Regulations", text: "When must a pilot-in-command of a civil aircraft have a current medical certificate?", choices: [{ key: "A", text: "Only when carrying passengers" }, { key: "B", text: "At all times when acting as pilot in command" }, { key: "C", text: "Only when operating under instrument flight rules" }], correct: "B" },
      { id: "PAR0003", aok: "Regulations", text: "Who has final authority and responsibility for the operation of an aircraft?", choices: [{ key: "A", text: "The air traffic controller" }, { key: "B", text: "The pilot in command" }, { key: "C", text: "The aircraft owner" }], correct: "B" },
      { id: "PAR0101", aok: "National Airspace System", text: "What is the vertical extent of Class D airspace when no other designation is given?", choices: [{ key: "A", text: "From the surface to 2,500 feet AGL" }, { key: "B", text: "From the surface to 3,000 feet AGL" }, { key: "C", text: "From the surface to 4,000 feet AGL" }], correct: "A" },
      { id: "PAR0102", aok: "National Airspace System", text: "What equipment is required for operation within Class C airspace?", choices: [{ key: "A", text: "Two-way radio communications and an operable transponder with altitude encoding capability" }, { key: "B", text: "Two-way radio communications only" }, { key: "C", text: "An operable transponder with altitude encoding capability only" }], correct: "A" },
      { id: "PAR0201", aok: "Weather", text: "A stable air mass is most likely to produce which type of clouds?", choices: [{ key: "A", text: "Cumulus" }, { key: "B", text: "Cumulonimbus" }, { key: "C", text: "Stratus" }], correct: "C" },
      { id: "PAR0202", aok: "Weather", text: "What does a SIGMET advise?", choices: [{ key: "A", text: "Significant meteorological conditions hazardous to all aircraft" }, { key: "B", text: "Pilot weather reports from other pilots" }, { key: "C", text: "Forecast for the route of flight" }], correct: "A" },
      { id: "PAR0301", aok: "Cross-Country Flight Planning", text: "What is the purpose of a VOR receiver check?", choices: [{ key: "A", text: "To verify the aircraft's transponder is functioning" }, { key: "B", text: "To ensure the VOR receiver meets accuracy standards" }, { key: "C", text: "To calibrate the aircraft's compass" }], correct: "B" },
      { id: "PAR0302", aok: "Cross-Country Flight Planning", text: "What is true course?", choices: [{ key: "A", text: "The course measured with respect to magnetic north" }, { key: "B", text: "The course measured with respect to true north" }, { key: "C", text: "The course corrected for wind" }], correct: "B" },
      { id: "PAR0401", aok: "Performance and Limitations", text: "What effect does high density altitude have on aircraft performance?", choices: [{ key: "A", text: "Increased engine power and improved climb performance" }, { key: "B", text: "Decreased engine power, reduced lift, and longer takeoff roll" }, { key: "C", text: "No significant effect on normally aspirated engines" }], correct: "B" },
      { id: "PAR0402", aok: "Performance and Limitations", text: "What is density altitude?", choices: [{ key: "A", text: "The altitude shown on the altimeter when set to 29.92" }, { key: "B", text: "Pressure altitude corrected for temperature variations from standard" }, { key: "C", text: "The altitude above sea level" }], correct: "B" },
      { id: "PAR0501", aok: "Principles of Flight", text: "What is the primary cause of lift?", choices: [{ key: "A", text: "Angle of attack alone" }, { key: "B", text: "The difference in pressure between the upper and lower wing surfaces" }, { key: "C", text: "Engine thrust pushing the aircraft upward" }], correct: "B" },
      { id: "PAR0502", aok: "Principles of Flight", text: "What is induced drag?", choices: [{ key: "A", text: "Drag caused by the aircraft's skin friction" }, { key: "B", text: "Drag created as a byproduct of lift production" }, { key: "C", text: "Drag caused by the landing gear in the slipstream" }], correct: "B" },
      { id: "PAR0601", aok: "Aircraft Systems", text: "What is the purpose of carburetor heat?", choices: [{ key: "A", text: "To increase engine power output in cold weather" }, { key: "B", text: "To prevent or remove carburetor ice" }, { key: "C", text: "To warm the fuel before combustion" }], correct: "B" },
      { id: "PAR0602", aok: "Aircraft Systems", text: "What is the function of the magneto system?", choices: [{ key: "A", text: "To power the aircraft's electrical system" }, { key: "B", text: "To provide ignition for the engine independent of the aircraft battery" }, { key: "C", text: "To regulate fuel flow to the engine" }], correct: "B" },
      { id: "PAR0701", aok: "Flight Instruments", text: "What is the pitot-static system used for?", choices: [{ key: "A", text: "To power the directional gyro and attitude indicator" }, { key: "B", text: "To provide inputs to the airspeed indicator, altimeter, and vertical speed indicator" }, { key: "C", text: "To determine the aircraft's magnetic heading" }], correct: "B" },
      { id: "PAR0702", aok: "Flight Instruments", text: "What instrument indicates rate of climb or descent in feet per minute?", choices: [{ key: "A", text: "Altimeter" }, { key: "B", text: "Vertical speed indicator (VSI)" }, { key: "C", text: "Attitude indicator" }], correct: "B" },
      { id: "PAR0801", aok: "Aeromedical Factors", text: "What is hypoxia?", choices: [{ key: "A", text: "A condition caused by excess nitrogen in the blood" }, { key: "B", text: "A deficiency of oxygen reaching body tissues" }, { key: "C", text: "Motion sickness caused by turbulence" }], correct: "B" },
      { id: "PAR0802", aok: "Aeromedical Factors", text: "What is spatial disorientation?", choices: [{ key: "A", text: "A visual impairment caused by looking at bright lights" }, { key: "B", text: "A false sense of orientation relative to the natural horizon" }, { key: "C", text: "Discomfort caused by altitude changes" }], correct: "B" },
    ],
  },

  IRA: {
    code: "IRA",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/IRA.zip",
    outputFile: "src/data/ira-questions.ts",
    prefix: "IRA",
    aoks: [
      "Regulations",
      "Flight Instruments",
      "Navigation and Flight Planning",
      "Weather",
      "IFR Procedures",
      "ATC Procedures",
      "Emergency Procedures",
    ],
    sampleQuestions: [
      { id: "IRA0001", aok: "Regulations", text: "What are the minimum weather conditions required to file and fly an IFR flight plan?", choices: [{ key: "A", text: "No minimum weather conditions; IFR can be filed at any time" }, { key: "B", text: "Ceiling at least 1,000 feet and visibility 3 statute miles" }, { key: "C", text: "Ceiling at least 500 feet and visibility 1 statute mile" }], correct: "A" },
      { id: "IRA0002", aok: "Regulations", text: "What recent experience is required to act as PIC under IFR?", choices: [{ key: "A", text: "6 instrument approaches, holding procedures, and intercepting/tracking courses in the preceding 6 months" }, { key: "B", text: "3 instrument approaches in the preceding 90 days" }, { key: "C", text: "An instrument proficiency check every 12 months" }], correct: "A" },
      { id: "IRA0003", aok: "Regulations", text: "What minimum equipment is required for IFR flight?", choices: [{ key: "A", text: "VOR or GPS receiver, altimeter, and communications radio" }, { key: "B", text: "The equipment specified by FAR 91.205(d)" }, { key: "C", text: "Autopilot and weather radar" }], correct: "B" },
      { id: "IRA0101", aok: "Flight Instruments", text: "What is the primary pitch instrument during a constant airspeed climb?", choices: [{ key: "A", text: "Attitude indicator" }, { key: "B", text: "Airspeed indicator" }, { key: "C", text: "Vertical speed indicator" }], correct: "B" },
      { id: "IRA0102", aok: "Flight Instruments", text: "If the vacuum system fails, which instruments are affected?", choices: [{ key: "A", text: "Airspeed indicator and altimeter" }, { key: "B", text: "Attitude indicator and heading indicator" }, { key: "C", text: "Turn coordinator and VSI" }], correct: "B" },
      { id: "IRA0201", aok: "Navigation and Flight Planning", text: "What is the purpose of a procedure turn?", choices: [{ key: "A", text: "To reverse course and establish the aircraft on the intermediate or final approach course" }, { key: "B", text: "To descend to the minimum descent altitude" }, { key: "C", text: "To enter a holding pattern" }], correct: "A" },
      { id: "IRA0202", aok: "Navigation and Flight Planning", text: "What does DME indicate?", choices: [{ key: "A", text: "Magnetic bearing to the station" }, { key: "B", text: "Slant-range distance to the station in nautical miles" }, { key: "C", text: "Ground speed and time to station only" }], correct: "B" },
      { id: "IRA0301", aok: "Weather", text: "What is a convective SIGMET?", choices: [{ key: "A", text: "A forecast of thunderstorms over a wide area" }, { key: "B", text: "An advisory for severe or embedded thunderstorms, hail, or tornadoes" }, { key: "C", text: "A pilot report of convective activity" }], correct: "B" },
      { id: "IRA0302", aok: "Weather", text: "What type of icing is associated with supercooled large droplets?", choices: [{ key: "A", text: "Rime ice" }, { key: "B", text: "Clear ice" }, { key: "C", text: "Mixed ice" }], correct: "B" },
      { id: "IRA0401", aok: "IFR Procedures", text: "What is the standard holding pattern entry for an aircraft approaching the holding fix on a heading that is within 70 degrees of the outbound course?", choices: [{ key: "A", text: "Direct entry" }, { key: "B", text: "Teardrop entry" }, { key: "C", text: "Parallel entry" }], correct: "B" },
      { id: "IRA0402", aok: "IFR Procedures", text: "What does MDA stand for in an instrument approach?", choices: [{ key: "A", text: "Minimum descent altitude" }, { key: "B", text: "Maximum diversion altitude" }, { key: "C", text: "Minimum decision altitude" }], correct: "A" },
      { id: "IRA0501", aok: "ATC Procedures", text: "What does 'cleared for the approach' mean?", choices: [{ key: "A", text: "You are cleared to descend to any altitude on the approach" }, { key: "B", text: "You are cleared to execute the published approach procedure" }, { key: "C", text: "You are cleared to land" }], correct: "B" },
      { id: "IRA0502", aok: "ATC Procedures", text: "When should a pilot execute a missed approach?", choices: [{ key: "A", text: "Only when instructed by ATC" }, { key: "B", text: "At the MAP if the required visual references are not in sight" }, { key: "C", text: "Anytime during the approach" }], correct: "B" },
      { id: "IRA0601", aok: "Emergency Procedures", text: "If you experience a communications failure in IFR conditions, what altitude should you fly?", choices: [{ key: "A", text: "Last assigned altitude only" }, { key: "B", text: "The highest of: last assigned, expected, or MEA" }, { key: "C", text: "Minimum en route altitude only" }], correct: "B" },
      { id: "IRA0602", aok: "Emergency Procedures", text: "What is the lost communication squawk code?", choices: [{ key: "A", text: "7500" }, { key: "B", text: "7600" }, { key: "C", text: "7700" }], correct: "B" },
    ],
  },

  CAX: {
    code: "CAX",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/CAX.zip",
    outputFile: "src/data/cax-questions.ts",
    prefix: "CAX",
    aoks: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Cross-Country Flight Planning",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
      "Commercial Operations",
    ],
    sampleQuestions: [
      { id: "CAX0001", aok: "Regulations", text: "What are the aeronautical experience requirements for a commercial pilot certificate with an airplane single-engine rating?", choices: [{ key: "A", text: "200 hours total, 100 PIC" }, { key: "B", text: "250 hours total, including specific PIC and cross-country time" }, { key: "C", text: "300 hours total" }], correct: "B" },
      { id: "CAX0002", aok: "Regulations", text: "A commercial pilot may NOT act as pilot in command of an aircraft for compensation or hire unless they hold at least a:", choices: [{ key: "A", text: "Third class medical certificate" }, { key: "B", text: "Second class medical certificate" }, { key: "C", text: "First class medical certificate" }], correct: "B" },
      { id: "CAX0003", aok: "Regulations", text: "What is the minimum age for a commercial pilot certificate?", choices: [{ key: "A", text: "17 years" }, { key: "B", text: "18 years" }, { key: "C", text: "21 years" }], correct: "B" },
      { id: "CAX0101", aok: "National Airspace System", text: "What is required to operate in Class A airspace?", choices: [{ key: "A", text: "VFR flight plan" }, { key: "B", text: "IFR flight plan and ATC clearance" }, { key: "C", text: "Special VFR clearance" }], correct: "B" },
      { id: "CAX0102", aok: "National Airspace System", text: "What altitude does Class A airspace extend to?", choices: [{ key: "A", text: "18,000 to 60,000 feet MSL" }, { key: "B", text: "18,000 to FL450" }, { key: "C", text: "18,000 to FL600" }], correct: "C" },
      { id: "CAX0201", aok: "Weather", text: "What is wind shear?", choices: [{ key: "A", text: "A change in wind speed and/or direction over a short distance" }, { key: "B", text: "Turbulence caused by mountain waves" }, { key: "C", text: "Gusty surface winds associated with fronts" }], correct: "A" },
      { id: "CAX0202", aok: "Weather", text: "What condition produces the most severe turbulence?", choices: [{ key: "A", text: "Radiation fog" }, { key: "B", text: "Mountain waves with rotor clouds" }, { key: "C", text: "Stratus cloud layers" }], correct: "B" },
      { id: "CAX0301", aok: "Cross-Country Flight Planning", text: "What is the maximum deviation allowed on a VOR check using a VOT?", choices: [{ key: "A", text: "+/- 4 degrees" }, { key: "B", text: "+/- 6 degrees" }, { key: "C", text: "+/- 2 degrees" }], correct: "A" },
      { id: "CAX0302", aok: "Cross-Country Flight Planning", text: "What is magnetic deviation?", choices: [{ key: "A", text: "The angular difference between true and magnetic north" }, { key: "B", text: "The compass error caused by magnetic fields within the aircraft" }, { key: "C", text: "The difference between indicated and calibrated airspeed" }], correct: "B" },
      { id: "CAX0401", aok: "Performance and Limitations", text: "How does increased weight affect Vso?", choices: [{ key: "A", text: "Vso decreases" }, { key: "B", text: "Vso increases" }, { key: "C", text: "Vso remains the same" }], correct: "B" },
      { id: "CAX0501", aok: "Principles of Flight", text: "What is Mach tuck?", choices: [{ key: "A", text: "A nose-up tendency at high Mach numbers" }, { key: "B", text: "A nose-down pitching tendency caused by shock wave formation on the wing" }, { key: "C", text: "Increased drag without speed change" }], correct: "B" },
      { id: "CAX0601", aok: "Aircraft Systems", text: "What is the purpose of a constant-speed propeller?", choices: [{ key: "A", text: "To maintain a fixed blade angle at all times" }, { key: "B", text: "To automatically adjust blade angle to maintain a selected RPM" }, { key: "C", text: "To provide reverse thrust for landing" }], correct: "B" },
      { id: "CAX0701", aok: "Flight Instruments", text: "What causes compass turning errors?", choices: [{ key: "A", text: "The magnetic dip of the compass card during turns" }, { key: "B", text: "Friction in the compass housing" }, { key: "C", text: "Electrical interference from avionics" }], correct: "A" },
      { id: "CAX0801", aok: "Aeromedical Factors", text: "At what cabin altitude is supplemental oxygen required for the flight crew?", choices: [{ key: "A", text: "10,000 feet MSL" }, { key: "B", text: "12,500 feet MSL for more than 30 minutes" }, { key: "C", text: "14,000 feet MSL" }], correct: "B" },
      { id: "CAX0901", aok: "Commercial Operations", text: "What operations may a commercial pilot conduct for hire?", choices: [{ key: "A", text: "Scheduled airline operations" }, { key: "B", text: "Banner towing, aerial photography, and crop dusting with appropriate ratings" }, { key: "C", text: "Air ambulance operations without restrictions" }], correct: "B" },
      { id: "CAX0902", aok: "Commercial Operations", text: "Under Part 91, who is responsible for determining whether an aircraft is airworthy?", choices: [{ key: "A", text: "The aircraft mechanic" }, { key: "B", text: "The pilot in command" }, { key: "C", text: "The aircraft owner" }], correct: "B" },
    ],
  },

  ATP: {
    code: "ATP",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/ATP.zip",
    outputFile: "src/data/atp-questions.ts",
    prefix: "ATP",
    aoks: [
      "Regulations",
      "Weather",
      "Navigation and Flight Planning",
      "Performance and Limitations",
      "Aerodynamics",
      "Aircraft Systems",
      "Crew Resource Management",
      "Emergency Procedures",
    ],
    sampleQuestions: [
      { id: "ATP0001", aok: "Regulations", text: "What is the minimum rest period for a Part 121 flight crew member before a flight duty period?", choices: [{ key: "A", text: "8 consecutive hours" }, { key: "B", text: "10 consecutive hours" }, { key: "C", text: "12 consecutive hours" }], correct: "B" },
      { id: "ATP0002", aok: "Regulations", text: "What is the minimum age for an airline transport pilot certificate?", choices: [{ key: "A", text: "21 years" }, { key: "B", text: "23 years" }, { key: "C", text: "25 years" }], correct: "B" },
      { id: "ATP0003", aok: "Regulations", text: "What total flight time is required for an ATP certificate?", choices: [{ key: "A", text: "1,000 hours" }, { key: "B", text: "1,500 hours" }, { key: "C", text: "2,000 hours" }], correct: "B" },
      { id: "ATP0101", aok: "Weather", text: "What is a jet stream?", choices: [{ key: "A", text: "A narrow band of high-velocity wind at high altitudes" }, { key: "B", text: "Turbulence near the tropopause" }, { key: "C", text: "A cold front aloft" }], correct: "A" },
      { id: "ATP0102", aok: "Weather", text: "What type of turbulence is associated with the jet stream?", choices: [{ key: "A", text: "Convective turbulence" }, { key: "B", text: "Clear air turbulence (CAT)" }, { key: "C", text: "Mechanical turbulence" }], correct: "B" },
      { id: "ATP0201", aok: "Navigation and Flight Planning", text: "What is RNAV?", choices: [{ key: "A", text: "A type of VOR approach" }, { key: "B", text: "Area navigation that allows flight on any desired path" }, { key: "C", text: "A radar navigation system" }], correct: "B" },
      { id: "ATP0202", aok: "Navigation and Flight Planning", text: "What does RNP stand for?", choices: [{ key: "A", text: "Required Navigation Performance" }, { key: "B", text: "Regional Navigation Procedure" }, { key: "C", text: "Radar Navigation Protocol" }], correct: "A" },
      { id: "ATP0301", aok: "Performance and Limitations", text: "What is V1?", choices: [{ key: "A", text: "Best angle of climb speed" }, { key: "B", text: "Takeoff decision speed" }, { key: "C", text: "Maximum tire speed" }], correct: "B" },
      { id: "ATP0302", aok: "Performance and Limitations", text: "What is the balanced field length?", choices: [{ key: "A", text: "Runway length where accelerate-stop distance equals accelerate-go distance" }, { key: "B", text: "The minimum runway length for landing" }, { key: "C", text: "The runway length required for a normal takeoff" }], correct: "A" },
      { id: "ATP0401", aok: "Aerodynamics", text: "What is Dutch roll?", choices: [{ key: "A", text: "A coupled oscillation of yaw and roll in swept-wing aircraft" }, { key: "B", text: "A nose-down pitch tendency at high Mach numbers" }, { key: "C", text: "Aileron buzz at high speed" }], correct: "A" },
      { id: "ATP0402", aok: "Aerodynamics", text: "What is the purpose of a yaw damper?", choices: [{ key: "A", text: "To prevent nose-up pitch at high altitudes" }, { key: "B", text: "To suppress Dutch roll oscillations" }, { key: "C", text: "To assist with crosswind landings" }], correct: "B" },
      { id: "ATP0501", aok: "Aircraft Systems", text: "What is the purpose of an APU?", choices: [{ key: "A", text: "To provide additional thrust during takeoff" }, { key: "B", text: "To supply electrical power and pneumatic bleed air on the ground" }, { key: "C", text: "To control cabin temperature only" }], correct: "B" },
      { id: "ATP0502", aok: "Aircraft Systems", text: "What does a TCAS resolution advisory (RA) require?", choices: [{ key: "A", text: "Contact ATC before maneuvering" }, { key: "B", text: "Immediate compliance with the vertical guidance" }, { key: "C", text: "Visual acquisition of the traffic before maneuvering" }], correct: "B" },
      { id: "ATP0601", aok: "Crew Resource Management", text: "What is the primary goal of CRM?", choices: [{ key: "A", text: "To establish a clear chain of command" }, { key: "B", text: "To optimize human performance and reduce errors through effective crew coordination" }, { key: "C", text: "To ensure the captain makes all decisions" }], correct: "B" },
      { id: "ATP0602", aok: "Crew Resource Management", text: "What is threat and error management (TEM)?", choices: [{ key: "A", text: "A maintenance tracking system" }, { key: "B", text: "A framework for anticipating threats, recognizing errors, and managing undesired aircraft states" }, { key: "C", text: "An ATC conflict resolution protocol" }], correct: "B" },
      { id: "ATP0701", aok: "Emergency Procedures", text: "What is the procedure for an engine fire on the ground during start?", choices: [{ key: "A", text: "Shut down immediately and evacuate" }, { key: "B", text: "Continue motoring the engine to draw the fire inward, then shut down if fire persists" }, { key: "C", text: "Apply parking brake and call fire department" }], correct: "B" },
    ],
  },

  MEA: {
    code: "MEA",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/MEA.zip",
    outputFile: "src/data/mea-questions.ts",
    prefix: "MEA",
    aoks: [
      "Multi-Engine Aerodynamics",
      "Engine-Out Procedures",
      "Performance and Limitations",
      "Systems",
      "Weight and Balance",
      "Emergency Procedures",
    ],
    sampleQuestions: [
      { id: "MEA0001", aok: "Multi-Engine Aerodynamics", text: "What is Vmc?", choices: [{ key: "A", text: "Minimum speed at which directional control can be maintained with one engine inoperative" }, { key: "B", text: "Maximum controllable speed" }, { key: "C", text: "Best single-engine climb speed" }], correct: "A" },
      { id: "MEA0002", aok: "Multi-Engine Aerodynamics", text: "What factors decrease Vmc?", choices: [{ key: "A", text: "Higher density altitude and aft CG" }, { key: "B", text: "Lower density altitude and forward CG" }, { key: "C", text: "Higher density altitude and forward CG" }], correct: "C" },
      { id: "MEA0003", aok: "Multi-Engine Aerodynamics", text: "What is the critical engine on a conventional twin?", choices: [{ key: "A", text: "The engine whose failure most adversely affects performance and handling" }, { key: "B", text: "The left engine always" }, { key: "C", text: "The engine with the most flight hours" }], correct: "A" },
      { id: "MEA0101", aok: "Engine-Out Procedures", text: "After an engine failure, what is the correct initial action?", choices: [{ key: "A", text: "Immediately feather the propeller" }, { key: "B", text: "Maintain directional control and identify the failed engine" }, { key: "C", text: "Declare an emergency" }], correct: "B" },
      { id: "MEA0102", aok: "Engine-Out Procedures", text: "Why should the propeller of the inoperative engine be feathered?", choices: [{ key: "A", text: "To reduce drag from the windmilling propeller" }, { key: "B", text: "To restart the engine" }, { key: "C", text: "To reduce noise" }], correct: "A" },
      { id: "MEA0201", aok: "Performance and Limitations", text: "What is Vyse (blue line speed)?", choices: [{ key: "A", text: "Best rate of climb speed with one engine inoperative" }, { key: "B", text: "Best angle of climb speed" }, { key: "C", text: "Maximum gear extension speed" }], correct: "A" },
      { id: "MEA0202", aok: "Performance and Limitations", text: "What is the effect of an engine failure on climb performance in a light twin?", choices: [{ key: "A", text: "Climb performance is reduced by 50%" }, { key: "B", text: "Climb performance is reduced by 80% or more" }, { key: "C", text: "Climb performance is unchanged" }], correct: "B" },
      { id: "MEA0301", aok: "Systems", text: "What is the purpose of crossfeed in a multi-engine fuel system?", choices: [{ key: "A", text: "To mix fuel from both tanks for better combustion" }, { key: "B", text: "To feed an engine from the opposite wing's fuel tank" }, { key: "C", text: "To balance fuel pressure between engines" }], correct: "B" },
      { id: "MEA0302", aok: "Systems", text: "What system prevents asymmetric flap deployment?", choices: [{ key: "A", text: "Interconnect cable or split flap protection system" }, { key: "B", text: "The autopilot" }, { key: "C", text: "Hydraulic dampers on each flap" }], correct: "A" },
      { id: "MEA0401", aok: "Weight and Balance", text: "How does exceeding the aft CG limit affect multi-engine handling?", choices: [{ key: "A", text: "No significant effect" }, { key: "B", text: "Increases Vmc and decreases directional stability" }, { key: "C", text: "Decreases Vmc" }], correct: "B" },
      { id: "MEA0402", aok: "Weight and Balance", text: "What is zero fuel weight?", choices: [{ key: "A", text: "Aircraft weight with no passengers or cargo" }, { key: "B", text: "Maximum weight of the aircraft excluding usable fuel" }, { key: "C", text: "Empty weight plus unusable fuel" }], correct: "B" },
      { id: "MEA0501", aok: "Emergency Procedures", text: "During a Vmc demonstration, what is the correct recovery?", choices: [{ key: "A", text: "Add full power on both engines" }, { key: "B", text: "Reduce power on the operative engine and lower the nose to regain airspeed" }, { key: "C", text: "Apply full rudder and increase pitch" }], correct: "B" },
      { id: "MEA0502", aok: "Emergency Procedures", text: "If an engine fire occurs in flight on a multi-engine airplane, the pilot should:", choices: [{ key: "A", text: "Shut down the affected engine, feather its propeller, and discharge the fire extinguisher" }, { key: "B", text: "Increase power on the affected engine to blow out the fire" }, { key: "C", text: "Continue to the nearest airport before taking any action" }], correct: "A" },
    ],
  },

  AGI: {
    code: "AGI",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/AGI.zip",
    outputFile: "src/data/agi-questions.ts",
    prefix: "AGI",
    aoks: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Flight Planning",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
      "Instructional Knowledge",
    ],
    sampleQuestions: [
      { id: "AGI0001", aok: "Regulations", text: "What privileges does an Advanced Ground Instructor certificate provide?", choices: [{ key: "A", text: "Authority to give ground training for any certificate except instrument" }, { key: "B", text: "Authority to give ground training and knowledge test endorsements for any certificate or rating" }, { key: "C", text: "Authority to conduct flight training" }], correct: "B" },
      { id: "AGI0002", aok: "Regulations", text: "An AGI may endorse a student for which knowledge tests?", choices: [{ key: "A", text: "Private, commercial, and ATP knowledge tests" }, { key: "B", text: "All knowledge tests except the instrument rating" }, { key: "C", text: "All certificate and rating knowledge tests" }], correct: "C" },
      { id: "AGI0101", aok: "National Airspace System", text: "What is the minimum visibility for Special VFR in Class D airspace?", choices: [{ key: "A", text: "1 statute mile and clear of clouds" }, { key: "B", text: "3 statute miles and 500 feet below clouds" }, { key: "C", text: "1 statute mile with 1,000 feet ceiling" }], correct: "A" },
      { id: "AGI0201", aok: "Weather", text: "What is the tropopause?", choices: [{ key: "A", text: "The boundary between the troposphere and stratosphere" }, { key: "B", text: "The highest level of cloud formation" }, { key: "C", text: "The layer of maximum turbulence" }], correct: "A" },
      { id: "AGI0301", aok: "Flight Planning", text: "What is the difference between true and magnetic heading?", choices: [{ key: "A", text: "Wind correction angle" }, { key: "B", text: "Magnetic variation" }, { key: "C", text: "Compass deviation" }], correct: "B" },
      { id: "AGI0302", aok: "Flight Planning", text: "How is magnetic heading determined from true heading?", choices: [{ key: "A", text: "Add easterly variation, subtract westerly variation" }, { key: "B", text: "Subtract easterly variation, add westerly variation" }, { key: "C", text: "Apply compass deviation only" }], correct: "A" },
      { id: "AGI0401", aok: "Performance and Limitations", text: "What is service ceiling?", choices: [{ key: "A", text: "The maximum altitude at which the aircraft can maintain 100 fpm climb" }, { key: "B", text: "The maximum altitude approved for operation" }, { key: "C", text: "The altitude where engine power is reduced by 50%" }], correct: "A" },
      { id: "AGI0501", aok: "Principles of Flight", text: "What is the relationship between angle of attack and airspeed at stall?", choices: [{ key: "A", text: "The critical angle of attack increases at lower airspeeds" }, { key: "B", text: "The critical angle of attack is constant regardless of airspeed" }, { key: "C", text: "The critical angle of attack decreases at higher airspeeds" }], correct: "B" },
      { id: "AGI0601", aok: "Aircraft Systems", text: "What is the function of a turbine engine's N1 gauge?", choices: [{ key: "A", text: "Exhaust gas temperature" }, { key: "B", text: "Fan or low-pressure compressor speed expressed as a percentage" }, { key: "C", text: "Oil pressure" }], correct: "B" },
      { id: "AGI0701", aok: "Flight Instruments", text: "What type of error does AHRS eliminate compared to traditional gyros?", choices: [{ key: "A", text: "Parallax error" }, { key: "B", text: "Precession error" }, { key: "C", text: "Static port blockage" }], correct: "B" },
      { id: "AGI0801", aok: "Aeromedical Factors", text: "What is the 'leans' in aviation?", choices: [{ key: "A", text: "A vestibular illusion causing a false sense of bank" }, { key: "B", text: "A tendency to fly with one wing low" }, { key: "C", text: "An instrument error" }], correct: "A" },
      { id: "AGI0901", aok: "Instructional Knowledge", text: "What is the Law of Primacy in teaching?", choices: [{ key: "A", text: "The first thing learned is the hardest to unlearn" }, { key: "B", text: "Practice makes perfect" }, { key: "C", text: "Students remember the last thing taught" }], correct: "A" },
      { id: "AGI0902", aok: "Instructional Knowledge", text: "What are the levels of learning in order?", choices: [{ key: "A", text: "Understanding, application, correlation, rote" }, { key: "B", text: "Rote, understanding, application, correlation" }, { key: "C", text: "Correlation, application, understanding, rote" }], correct: "B" },
    ],
  },

  FOI: {
    code: "FOI",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/FOI.zip",
    outputFile: "src/data/foi-questions.ts",
    prefix: "FOI",
    aoks: [
      "The Learning Process",
      "Human Behavior and Communication",
      "The Teaching Process",
      "Assessment and Critique",
      "Instructor Responsibilities",
      "Techniques of Flight Instruction",
    ],
    sampleQuestions: [
      { id: "FOI0001", aok: "The Learning Process", text: "What are the four levels of learning?", choices: [{ key: "A", text: "Rote, understanding, application, correlation" }, { key: "B", text: "Knowledge, comprehension, application, analysis" }, { key: "C", text: "Memory, recall, practice, mastery" }], correct: "A" },
      { id: "FOI0002", aok: "The Learning Process", text: "What is the Law of Effect?", choices: [{ key: "A", text: "Learning is strengthened when accompanied by a satisfying experience" }, { key: "B", text: "Students learn best through repetition" }, { key: "C", text: "The most recent learning is remembered best" }], correct: "A" },
      { id: "FOI0003", aok: "The Learning Process", text: "What is the Law of Readiness?", choices: [{ key: "A", text: "Things most recently learned are best remembered" }, { key: "B", text: "A person learns best when ready and motivated to learn" }, { key: "C", text: "Connections are strengthened with practice" }], correct: "B" },
      { id: "FOI0101", aok: "Human Behavior and Communication", text: "What is a common defense mechanism where a person refuses to accept reality?", choices: [{ key: "A", text: "Projection" }, { key: "B", text: "Denial" }, { key: "C", text: "Rationalization" }], correct: "B" },
      { id: "FOI0102", aok: "Human Behavior and Communication", text: "What is effective communication in an instructional setting?", choices: [{ key: "A", text: "Using technical jargon to demonstrate expertise" }, { key: "B", text: "The successful transmission of information resulting in understanding by the receiver" }, { key: "C", text: "Speaking loudly and clearly" }], correct: "B" },
      { id: "FOI0201", aok: "The Teaching Process", text: "What is the most effective teaching method for flight instruction?", choices: [{ key: "A", text: "Lecture only" }, { key: "B", text: "Demonstration-performance method" }, { key: "C", text: "Reading assignments" }], correct: "B" },
      { id: "FOI0202", aok: "The Teaching Process", text: "What are the steps in the demonstration-performance method?", choices: [{ key: "A", text: "Explain, demonstrate, guide, practice, evaluate" }, { key: "B", text: "Read, memorize, test" }, { key: "C", text: "Show, tell, repeat" }], correct: "A" },
      { id: "FOI0301", aok: "Assessment and Critique", text: "An effective critique should be:", choices: [{ key: "A", text: "Focused only on what the student did wrong" }, { key: "B", text: "Objective, constructive, and focused on student improvement" }, { key: "C", text: "Given only at the end of training" }], correct: "B" },
      { id: "FOI0302", aok: "Assessment and Critique", text: "What is the difference between a written test and a performance test?", choices: [{ key: "A", text: "Written tests measure knowledge; performance tests measure ability to perform tasks" }, { key: "B", text: "There is no difference" }, { key: "C", text: "Written tests are always more accurate" }], correct: "A" },
      { id: "FOI0401", aok: "Instructor Responsibilities", text: "What is the instructor's primary responsibility?", choices: [{ key: "A", text: "To make the student feel comfortable" }, { key: "B", text: "To help students learn and develop safe aviation practices" }, { key: "C", text: "To ensure students pass the knowledge test" }], correct: "B" },
      { id: "FOI0402", aok: "Instructor Responsibilities", text: "What is a learning plateau?", choices: [{ key: "A", text: "A period where no apparent progress is being made despite continued effort" }, { key: "B", text: "The highest level of skill a student can achieve" }, { key: "C", text: "A teaching technique for slow learners" }], correct: "A" },
      { id: "FOI0501", aok: "Techniques of Flight Instruction", text: "What is positive transfer of learning?", choices: [{ key: "A", text: "When old learning interferes with new learning" }, { key: "B", text: "When previously learned skills help in learning new skills" }, { key: "C", text: "When a student progresses from ground to flight training" }], correct: "B" },
      { id: "FOI0502", aok: "Techniques of Flight Instruction", text: "What should an instructor do when a student exhibits anxiety during flight?", choices: [{ key: "A", text: "Ignore it and continue the lesson" }, { key: "B", text: "Recognize the anxiety, provide reassurance, and adjust the lesson as needed" }, { key: "C", text: "End the flight immediately" }], correct: "B" },
    ],
  },

  FIA: {
    code: "FIA",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/FIA.zip",
    outputFile: "src/data/fia-questions.ts",
    prefix: "FIA",
    aoks: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Flight Planning",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
      "Flight Instruction Techniques",
    ],
    sampleQuestions: [
      { id: "FIA0001", aok: "Regulations", text: "What are the requirements for a flight instructor certificate?", choices: [{ key: "A", text: "Hold at least a commercial pilot certificate with an instrument rating" }, { key: "B", text: "Hold at least a private pilot certificate" }, { key: "C", text: "Hold an ATP certificate" }], correct: "A" },
      { id: "FIA0002", aok: "Regulations", text: "How long is a flight instructor certificate valid?", choices: [{ key: "A", text: "12 calendar months" }, { key: "B", text: "24 calendar months" }, { key: "C", text: "36 calendar months" }], correct: "B" },
      { id: "FIA0003", aok: "Regulations", text: "What record must a flight instructor maintain for each student?", choices: [{ key: "A", text: "Only the final endorsement for the checkride" }, { key: "B", text: "A training record including the date, content, and result of each training session" }, { key: "C", text: "A copy of the student's medical certificate" }], correct: "B" },
      { id: "FIA0101", aok: "National Airspace System", text: "Under what conditions may Special VFR operations be conducted at night?", choices: [{ key: "A", text: "Only by instrument-rated pilots in instrument-capable aircraft" }, { key: "B", text: "With any valid pilot certificate" }, { key: "C", text: "Night Special VFR is never permitted" }], correct: "A" },
      { id: "FIA0201", aok: "Weather", text: "What weather conditions produce the most turbulence near the surface?", choices: [{ key: "A", text: "Strong solar heating over rough terrain" }, { key: "B", text: "Overcast skies with steady winds" }, { key: "C", text: "Cool temperatures with smooth terrain" }], correct: "A" },
      { id: "FIA0301", aok: "Flight Planning", text: "What must an instructor verify before endorsing a student for solo cross-country?", choices: [{ key: "A", text: "The student has planned the flight and has adequate weather and fuel" }, { key: "B", text: "The student holds an instrument rating" }, { key: "C", text: "The student has 50 hours of PIC time" }], correct: "A" },
      { id: "FIA0401", aok: "Performance and Limitations", text: "How does CG position affect stall speed?", choices: [{ key: "A", text: "Forward CG increases stall speed" }, { key: "B", text: "Forward CG decreases stall speed" }, { key: "C", text: "CG position has no effect on stall speed" }], correct: "A" },
      { id: "FIA0501", aok: "Principles of Flight", text: "What causes an accelerated stall?", choices: [{ key: "A", text: "Exceeding the critical angle of attack at a speed above normal stall speed due to load factor" }, { key: "B", text: "Slow speed in level flight" }, { key: "C", text: "Engine failure during climb" }], correct: "A" },
      { id: "FIA0601", aok: "Aircraft Systems", text: "What is the purpose of a constant-speed propeller governor?", choices: [{ key: "A", text: "To maintain engine temperature" }, { key: "B", text: "To automatically adjust propeller pitch to maintain a selected RPM" }, { key: "C", text: "To limit maximum engine power" }], correct: "B" },
      { id: "FIA0701", aok: "Flight Instruments", text: "What does a glass cockpit PFD typically display?", choices: [{ key: "A", text: "Engine instruments only" }, { key: "B", text: "Attitude, airspeed, altitude, heading, and vertical speed" }, { key: "C", text: "Navigation charts only" }], correct: "B" },
      { id: "FIA0801", aok: "Aeromedical Factors", text: "What is the somatogravic illusion?", choices: [{ key: "A", text: "A false sense of climbing during rapid acceleration" }, { key: "B", text: "A false sense of turning" }, { key: "C", text: "Loss of vision at high altitude" }], correct: "A" },
      { id: "FIA0901", aok: "Flight Instruction Techniques", text: "What is the sterile cockpit concept?", choices: [{ key: "A", text: "Keeping the cockpit clean and organized" }, { key: "B", text: "Limiting non-essential conversation during critical phases of flight" }, { key: "C", text: "Using noise-canceling headsets" }], correct: "B" },
      { id: "FIA0902", aok: "Flight Instruction Techniques", text: "How should an instructor introduce a new flight maneuver?", choices: [{ key: "A", text: "Let the student attempt it first without guidance" }, { key: "B", text: "Explain the purpose, demonstrate the maneuver, then guide the student through practice" }, { key: "C", text: "Provide a written description only" }], correct: "B" },
    ],
  },

  FII: {
    code: "FII",
    zipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/FII.zip",
    outputFile: "src/data/fii-questions.ts",
    prefix: "FII",
    aoks: [
      "Regulations",
      "Flight Instruments",
      "Navigation and Flight Planning",
      "Weather",
      "IFR Procedures",
      "ATC Procedures",
      "Instructional Knowledge",
    ],
    sampleQuestions: [
      { id: "FII0001", aok: "Regulations", text: "What are the currency requirements for a CFII to give instrument training?", choices: [{ key: "A", text: "An instrument proficiency check every 6 months" }, { key: "B", text: "The CFII must maintain instrument currency per FAR 61.57" }, { key: "C", text: "No additional instrument currency beyond the CFI certificate" }], correct: "B" },
      { id: "FII0002", aok: "Regulations", text: "What endorsement must a CFII provide before a student can take the instrument rating knowledge test?", choices: [{ key: "A", text: "A logbook endorsement certifying the student has received the required ground training" }, { key: "B", text: "A letter to the testing center" }, { key: "C", text: "No endorsement is needed" }], correct: "A" },
      { id: "FII0003", aok: "Regulations", text: "Under what conditions may an instrument student act as sole manipulator of the controls in IMC?", choices: [{ key: "A", text: "When a CFII or instrument-rated safety pilot is aboard" }, { key: "B", text: "Only after receiving an instrument rating" }, { key: "C", text: "When the student holds a private pilot certificate" }], correct: "A" },
      { id: "FII0101", aok: "Flight Instruments", text: "What is the primary bank instrument during a standard rate turn?", choices: [{ key: "A", text: "Attitude indicator" }, { key: "B", text: "Turn coordinator" }, { key: "C", text: "Heading indicator" }], correct: "B" },
      { id: "FII0102", aok: "Flight Instruments", text: "What is the lag in the VSI and when is it significant?", choices: [{ key: "A", text: "6-9 seconds; it is significant during rapid pitch changes" }, { key: "B", text: "No lag; VSI is instantaneous" }, { key: "C", text: "30 seconds; only during turbulence" }], correct: "A" },
      { id: "FII0201", aok: "Navigation and Flight Planning", text: "What is the difference between LPV and LNAV approaches?", choices: [{ key: "A", text: "LPV provides vertical guidance; LNAV provides lateral guidance only" }, { key: "B", text: "They are identical" }, { key: "C", text: "LNAV has lower minimums than LPV" }], correct: "A" },
      { id: "FII0202", aok: "Navigation and Flight Planning", text: "What does WAAS provide?", choices: [{ key: "A", text: "Enhanced GPS accuracy for precision-like approaches" }, { key: "B", text: "Radar approach capability" }, { key: "C", text: "VOR/DME replacement only" }], correct: "A" },
      { id: "FII0301", aok: "Weather", text: "What is the significance of freezing rain for instrument flight?", choices: [{ key: "A", text: "It indicates light turbulence only" }, { key: "B", text: "It can cause rapid and severe structural icing; the flight should avoid or exit the area immediately" }, { key: "C", text: "It improves visibility below the clouds" }], correct: "B" },
      { id: "FII0302", aok: "Weather", text: "What weather product shows expected icing levels?", choices: [{ key: "A", text: "METAR" }, { key: "B", text: "Current Icing Potential (CIP) and Forecast Icing Potential (FIP) charts" }, { key: "C", text: "TAF only" }], correct: "B" },
      { id: "FII0401", aok: "IFR Procedures", text: "What is the maximum speed below 10,000 feet MSL in IFR flight?", choices: [{ key: "A", text: "200 knots" }, { key: "B", text: "250 knots" }, { key: "C", text: "No speed limit under IFR" }], correct: "B" },
      { id: "FII0402", aok: "IFR Procedures", text: "What is a timed approach from a holding fix?", choices: [{ key: "A", text: "An approach where ATC assigns specific times for each aircraft to leave the hold and begin the approach" }, { key: "B", text: "An approach limited to 5 minutes" }, { key: "C", text: "A practice approach during VFR conditions" }], correct: "A" },
      { id: "FII0501", aok: "ATC Procedures", text: "What does 'radar contact' mean from ATC?", choices: [{ key: "A", text: "You are cleared for the approach" }, { key: "B", text: "Your aircraft has been identified on the radar display" }, { key: "C", text: "You are in a radar-controlled environment and can cancel IFR" }], correct: "B" },
      { id: "FII0502", aok: "ATC Procedures", text: "What is a clearance limit?", choices: [{ key: "A", text: "The maximum altitude assigned" }, { key: "B", text: "The fix, point, or location to which an aircraft is cleared" }, { key: "C", text: "The speed limit in the terminal area" }], correct: "B" },
      { id: "FII0601", aok: "Instructional Knowledge", text: "What is the most effective way to teach instrument scanning?", choices: [{ key: "A", text: "Have the student memorize the instrument panel layout" }, { key: "B", text: "Demonstrate a methodical cross-check technique and have the student practice progressively" }, { key: "C", text: "Tell the student to focus on the attitude indicator only" }], correct: "B" },
      { id: "FII0602", aok: "Instructional Knowledge", text: "How should a CFII handle a student who fixates on one instrument?", choices: [{ key: "A", text: "Cover the instrument being fixated on" }, { key: "B", text: "Identify the fixation, explain its dangers, and practice cross-check drills" }, { key: "C", text: "Ignore it; fixation resolves with experience" }], correct: "B" },
    ],
  },
};

const ALL_BANK_CODES = Object.keys(BANK_CONFIG);

// ===========================================================================
// Download helpers
// ===========================================================================

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;

    function request(targetUrl, redirectCount = 0) {
      if (redirectCount > 5) return reject(new Error("Too many redirects"));
      const proto = targetUrl.startsWith("https") ? https : http;
      proto.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, targetUrl).href;
          request(next, redirectCount + 1);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${targetUrl}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
        file.on("error", reject);
      }).on("error", reject);
    }

    request(url);
  });
}

// ===========================================================================
// ZIP extraction (system unzip)
// ===========================================================================

async function extractZip(zipPath, outDir) {
  const { execSync } = await import("child_process");
  mkdirSync(outDir, { recursive: true });
  execSync(`unzip -o "${zipPath}" -d "${outDir}"`, { stdio: "pipe" });
  console.log(`  Extracted to ${outDir}`);
}

// ===========================================================================
// RTF stripping
// ===========================================================================

function stripRtf(rtf) {
  let text = rtf;

  // Remove binary embedded objects
  text = text.replace(/\{\\pict[^}]*\}/gs, "");
  text = text.replace(/\{\\object[^}]*\}/gs, "");

  // Replace common RTF escape sequences
  text = text.replace(/\\par\b/g, "\n");
  text = text.replace(/\\line\b/g, "\n");
  text = text.replace(/\\tab\b/g, "\t");
  text = text.replace(/\\lquote\b/g, "'");
  text = text.replace(/\\rquote\b/g, "'");
  text = text.replace(/\\ldblquote\b/g, '"');
  text = text.replace(/\\rdblquote\b/g, '"');
  text = text.replace(/\\emdash\b/g, "\u2014");
  text = text.replace(/\\endash\b/g, "\u2013");
  text = text.replace(/\\bullet\b/g, "\u2022");

  // Remove RTF control words with parameters
  text = text.replace(/\\[a-zA-Z]+(-?\d+)?\s?/g, "");

  // Remove RTF braces
  text = text.replace(/[{}]/g, "");

  // Collapse whitespace
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/\r/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/[ \t]{2,}/g, " ");
  text = text.trim();

  return text;
}

// ===========================================================================
// AOK mapping from PLT codes (generalized per bank)
// ===========================================================================

/**
 * Build an AOK-guesser for a given bank config.
 * Uses PLT code numeric ranges plus text-based heuristic fallback.
 */
function buildAokGuesser(bankCfg) {
  const aoks = bankCfg.aoks;

  // Text heuristic keywords per common AOK name
  const TEXT_HINTS = {
    "Regulations": ["regulation", "far ", "§", "certificate", "required by", "14 cfr"],
    "National Airspace System": ["airspace", "class b", "class c", "class d", "class e", "class g", "tfr", "notam"],
    "Weather": ["weather", "metar", "taf", "sigmet", "pirep", "icing", "fog", "dew point", "pressure", "temperature", "wind", "thunderstorm", "turbulence", "front", "tropopause"],
    "Cross-Country Flight Planning": ["navigation", "cross-country", "sectional", "vfr", "chart", "vor", "course", "heading", "flight plan", "e6b"],
    "Navigation and Flight Planning": ["navigation", "cross-country", "sectional", "vor", "course", "heading", "flight plan", "rnav", "dme", "gps", "waypoint", "procedure turn"],
    "Flight Planning": ["navigation", "cross-country", "sectional", "vor", "course", "heading", "flight plan", "variation", "deviation"],
    "Performance and Limitations": ["performance", "density altitude", "takeoff distance", "landing distance", "climb", "cruise", "weight and balance", "gross weight", "load factor", "v-speed", "stall speed"],
    "Principles of Flight": ["lift", "drag", "stall", "angle of attack", "stability", "load factor", "bernoulli", "adverse yaw", "ground effect", "spin"],
    "Aerodynamics": ["lift", "drag", "stall", "angle of attack", "stability", "dutch roll", "mach", "compressibility", "swept wing"],
    "Aircraft Systems": ["engine", "fuel system", "magneto", "carburetor", "mixture", "oil", "alternator", "propeller", "hydraulic", "electrical system"],
    "Systems": ["engine", "fuel system", "propeller", "hydraulic", "crossfeed", "flap"],
    "Flight Instruments": ["altimeter", "airspeed", "attitude indicator", "gyro", "vsi", "pitot", "static", "compass", "heading indicator", "turn coordinator"],
    "Aeromedical Factors": ["hypoxia", "vision", "spatial", "fatigue", "alcohol", "medication", "vertigo", "hyperventilat", "imsafe", "carbon monoxide"],
    "Commercial Operations": ["commercial", "for hire", "compensation", "banner tow", "aerial", "charter", "part 135"],
    "Crew Resource Management": ["crm", "crew", "communication", "workload", "leadership", "threat and error"],
    "Emergency Procedures": ["emergency", "engine failure", "fire", "ditching", "evacuation", "comm failure", "lost communication"],
    "Multi-Engine Aerodynamics": ["vmc", "critical engine", "asymmetric", "multi-engine", "twin"],
    "Engine-Out Procedures": ["engine-out", "feather", "engine failure", "single engine", "dead foot"],
    "Weight and Balance": ["weight and balance", "cg", "center of gravity", "moment", "arm", "zero fuel weight"],
    "The Learning Process": ["learning", "rote", "understanding", "application", "correlation", "law of effect", "law of readiness", "law of exercise"],
    "Human Behavior and Communication": ["defense mechanism", "denial", "projection", "rationalization", "communication", "motivation", "anxiety"],
    "The Teaching Process": ["demonstration", "lecture", "teaching method", "lesson plan", "training syllabus"],
    "Assessment and Critique": ["critique", "assessment", "evaluation", "test", "oral exam", "practical test"],
    "Instructor Responsibilities": ["instructor", "endorsement", "training record", "responsibility", "plateau"],
    "Techniques of Flight Instruction": ["flight instruction", "maneuver", "transfer of learning", "positive transfer", "sterile cockpit"],
    "Flight Instruction Techniques": ["flight instruction", "maneuver", "demonstration", "sterile cockpit", "scenario-based"],
    "Instructional Knowledge": ["instructional", "teaching", "levels of learning", "primacy", "plateau", "scanning"],
    "IFR Procedures": ["holding", "approach", "mda", "decision altitude", "missed approach", "procedure turn", "ifr"],
    "ATC Procedures": ["clearance", "atc", "radar contact", "approach control", "center", "tower", "ground"],
  };

  return function aokFromCode(pltCodeNum, text) {
    const lower = (text || "").toLowerCase();

    // PLT code heuristic — divide the PLT number space across this bank's AOK list
    if (pltCodeNum) {
      const c = parseInt(pltCodeNum, 10);
      // Spread PLT codes across AOKs evenly from 0..999
      const bucketSize = Math.ceil(1000 / aoks.length);
      const idx = Math.min(Math.floor(c / bucketSize), aoks.length - 1);
      return aoks[idx];
    }

    // Text-based fallback: check bank's AOKs in order for keyword matches
    for (const aok of aoks) {
      const hints = TEXT_HINTS[aok];
      if (hints && hints.some((h) => lower.includes(h))) {
        return aok;
      }
    }

    // Default to first AOK
    return aoks[0];
  };
}

// ===========================================================================
// Question parser (generic for all banks)
// ===========================================================================

function parseQuestions(text, bankCfg) {
  const questions = [];
  const aokGuesser = buildAokGuesser(bankCfg);
  const prefix = bankCfg.prefix;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let i = 0;

  // Build a regex that matches the bank code prefix or generic numbered questions
  const bankPrefixRe = new RegExp(`^${prefix}[- ]?(\\d+)\\.?\\s*`, "i");

  while (i < lines.length) {
    // Try to detect question start
    const questionStartMatch =
      lines[i].match(/^(\d{4,})\.\s+(PLT\d+)?\s*(NO|YES)?\s*$/) ||
      lines[i].match(bankPrefixRe) ||
      lines[i].match(/^(\d{4,})\.\s+/);

    if (!questionStartMatch) {
      i++;
      continue;
    }

    const questionNum = questionStartMatch[1];
    const pltCode = questionStartMatch[2] || "";

    // Collect question text (lines until we see A--)
    const textLines = [];
    i++;
    while (i < lines.length && !lines[i].match(/^[ABC][—\-\.]\s/)) {
      if (lines[i].match(/^\d{4,}\./)) break;
      if (lines[i].match(bankPrefixRe)) break;
      textLines.push(lines[i]);
      i++;
    }

    const questionText = textLines
      .filter((l) => !l.match(/^\(Refer to/i))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (!questionText || questionText.length < 10) continue;

    // Collect choices
    const choices = [];
    while (i < lines.length && choices.length < 3) {
      const choiceMatch = lines[i].match(/^([ABC])[—\-\.]\s+(.+)/);
      if (choiceMatch) {
        choices.push({ key: choiceMatch[1], text: choiceMatch[2].trim() });
        i++;
      } else if (lines[i].match(/^\d{4,}\./) || lines[i].match(bankPrefixRe)) {
        break;
      } else {
        // Continuation of previous choice
        if (choices.length > 0) {
          choices[choices.length - 1].text += " " + lines[i];
        }
        i++;
      }
    }

    if (choices.length < 3) continue;

    // Skip metadata lines between choices and next question
    while (
      i < lines.length &&
      !lines[i].match(/^\d{4,}\./) &&
      !lines[i].match(bankPrefixRe)
    ) {
      i++;
    }

    const pltNum = pltCode.replace("PLT", "");
    const aok = aokGuesser(pltNum || null, questionText);

    questions.push({
      id: `${prefix}${questionNum.padStart(4, "0")}`,
      aok,
      text: questionText,
      choices: choices.map((c) => ({ key: c.key, text: c.text })),
      correct: "A", // default — will be overridden by answer key
    });
  }

  return questions;
}

/**
 * Try to extract answers from a separate answer-key section if present.
 */
function applyAnswerKey(questions, text) {
  const answerPattern = /\b(\d{4,})\s+([ABC])\b/g;
  const answerMap = new Map();
  let m;
  while ((m = answerPattern.exec(text)) !== null) {
    answerMap.set(m[1], m[2]);
  }

  if (answerMap.size === 0) return questions;

  return questions.map((q) => {
    const num = q.id.replace(/\D/g, "");
    const ans = answerMap.get(num);
    return ans ? { ...q, correct: ans } : q;
  });
}

// ===========================================================================
// Fisher-Yates shuffle (for AOK distribution when parsing yields uneven results)
// ===========================================================================

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===========================================================================
// Process a single bank
// ===========================================================================

async function processBank(bankCode) {
  const cfg = BANK_CONFIG[bankCode];
  if (!cfg) {
    console.error(`Unknown bank code: ${bankCode}`);
    console.error(`Valid codes: ${ALL_BANK_CODES.join(", ")}`);
    process.exit(1);
  }

  const TMP_ZIP = `/tmp/${cfg.code}.zip`;
  const TMP_DIR = `/tmp/${cfg.code.toLowerCase()}-extracted`;
  const OUT_FILE = join(ROOT, cfg.outputFile);

  console.log(`\n========================================`);
  console.log(`Processing ${cfg.code} test bank...`);
  console.log(`URL: ${cfg.zipUrl}`);
  console.log(`========================================`);

  let rawText = "";

  try {
    await downloadFile(cfg.zipUrl, TMP_ZIP);
    console.log(`  Downloaded to ${TMP_ZIP}`);

    await extractZip(TMP_ZIP, TMP_DIR);

    const allFiles = readdirSync(TMP_DIR);
    console.log("  Extracted files:", allFiles.join(", "));

    for (const f of allFiles) {
      const ext = f.toLowerCase();
      if (ext.endsWith(".rtf") || ext.endsWith(".txt")) {
        const content = readFileSync(join(TMP_DIR, f), "utf8");
        rawText += content + "\n";
      }
    }

    if (!rawText) {
      for (const f of allFiles) {
        try {
          rawText += readFileSync(join(TMP_DIR, f), { encoding: "utf8", flag: "r" }) + "\n";
        } catch {}
      }
    }
  } catch (err) {
    console.warn(`  Download/extraction failed: ${err.message}`);
    console.warn("  Generating data file from sample questions...");
  }

  let questions = [];

  if (rawText) {
    const stripped = stripRtf(rawText);
    console.log(`  Stripped text length: ${stripped.length} chars`);
    questions = parseQuestions(stripped, cfg);
    questions = applyAnswerKey(questions, stripped);
    console.log(`  Parsed ${questions.length} questions`);
  }

  if (questions.length < 10) {
    console.warn("  Too few questions parsed — using embedded sample set.");
    questions = cfg.sampleQuestions;
  }

  // Deduplicate by id
  const seen = new Set();
  questions = questions.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });

  const updatedAt = new Date().toISOString();
  const code = cfg.code;

  const ts = `// AUTO-GENERATED by scripts/download-test-bank.mjs
// Bank: ${code}
// Last updated: ${updatedAt}
// Do not edit manually — run the script to regenerate.

import type { TestBankQuestion } from "./test-bank-types";

export const ${code}_DATA_UPDATED = "${updatedAt}";

export const ${code}_AREAS_OF_KNOWLEDGE = [
${cfg.aoks.map((a) => `  "${a}",`).join("\n")}
] as const;

export const ${code}_QUESTIONS: TestBankQuestion[] = ${JSON.stringify(questions, null, 2)};
`;

  mkdirSync(join(ROOT, "src/data"), { recursive: true });
  writeFileSync(OUT_FILE, ts, "utf8");
  console.log(`  Wrote ${questions.length} questions to ${OUT_FILE}`);
  console.log("  Distribution by AOK:");
  for (const aok of cfg.aoks) {
    const count = questions.filter((q) => q.aok === aok).length;
    console.log(`    ${aok}: ${count}`);
  }
}

// ===========================================================================
// Main
// ===========================================================================

async function main() {
  const args = process.argv.slice(2).map((a) => a.toUpperCase());

  if (args.length === 0) {
    console.log("Usage:");
    console.log("  node scripts/download-test-bank.mjs PAR          # single bank");
    console.log("  node scripts/download-test-bank.mjs PAR IRA CAX  # multiple banks");
    console.log("  node scripts/download-test-bank.mjs --all        # all 11 banks");
    console.log(`\nAvailable banks: ${ALL_BANK_CODES.join(", ")}`);
    process.exit(0);
  }

  const banks = args.includes("--ALL") ? ALL_BANK_CODES : args;

  for (const code of banks) {
    await processBank(code);
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
