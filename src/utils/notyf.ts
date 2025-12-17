import { Notyf } from "notyf";
import "notyf/notyf.min.css";

let notyfInstance: Notyf | null = null;

export function getNotyf(): Notyf {
    if (!notyfInstance) {
        notyfInstance = new Notyf({
            position: { x: "right", y: "top" },
        });
    }
    return notyfInstance;
}
