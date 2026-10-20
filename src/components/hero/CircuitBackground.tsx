import { ChipCore } from "./ChipCore";
import { CircuitSpotlight } from "./CircuitSpotlight";
import { CIRCUIT_PADS, CIRCUIT_PULSES, CIRCUIT_TRACES } from "./circuit-paths";
import "./circuit.css";

const TRACE_STROKE = "rgba(255,255,255,0.13)";
// Pads are brighter than traces: circuitOpacity * 2.4, as in the design.
const PAD_STROKE = "rgba(255,255,255,0.312)";

export function CircuitBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-1/2 aspect-[1440/900] w-[max(100%,1100px)] -translate-x-1/2"
    >
      <svg viewBox="0 0 1440 900" className="absolute inset-0 block size-full" aria-hidden="true">
        <g fill="none" strokeWidth={1.2} stroke={TRACE_STROKE}>
          {CIRCUIT_TRACES.map((trace) => (
            <path
              key={trace.d}
              className="trace"
              d={trace.d}
              pathLength={100}
              style={{ animationDelay: `${trace.delay}s` }}
            />
          ))}
        </g>
        <g fill="#000000" strokeWidth={1.2} stroke={PAD_STROKE}>
          {CIRCUIT_PADS.map((pad) => (
            <circle key={`${pad.cx}-${pad.cy}`} cx={pad.cx} cy={pad.cy} r={3.5} />
          ))}
        </g>
        <g>
          {CIRCUIT_PULSES.map((pulse) => (
            <path
              key={pulse.d}
              className={pulse.green ? "pulse g" : "pulse"}
              d={pulse.d}
              pathLength={100}
              style={{ animationDuration: `${pulse.duration}s`, animationDelay: `${pulse.delay}s` }}
            />
          ))}
        </g>
      </svg>
      <CircuitSpotlight />
      <ChipCore />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(to_bottom,rgba(0,0,0,0),#000000)]" />
    </div>
  );
}
