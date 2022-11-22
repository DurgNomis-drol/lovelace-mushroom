import { HassEntity } from "home-assistant-js-websocket";
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
    computeRTL,
    debounce,
    HomeAssistant,
    isActive,
    isAvailable,
    
} from "../../../ha";
import "../../../shared/button";
import "../../../shared/button-group";
import { entityCardConfigStruct } from "../../entity-card/entity-card-config";

@customElement("mushroom-template-buttons")
export class TemplateButtons extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;

    @property({ attribute: false }) public controls!: any;

    @property() public fill: boolean = false;

    private _callService(ctrl, e: MouseEvent) {
        e.stopPropagation();
        const entity = ctrl.entity;
        const domain = entity.split(".")[0];
        const service = domain == "input_button" || domain == "button" ? "press" : "toggle";
        this.hass.callService(domain, service, {entity_id: entity});
    }

    private _findCollapseController() {
        var ctrl = this.controls.findIndex(e => "control_collapse" in e == true);
        return ctrl
    }

    private _isControllable() {
        const index = this._findCollapseController();
        if (index != -1) {
            return isActive(this.hass.states[this.controls[index].entity])
        } else {
            return true
        }
    }

    protected render(): TemplateResult {
        const rtl = computeRTL(this.hass);

        const ctrl_entity = this.controls[this._findCollapseController()]

        return html`
            <mushroom-button-group .fill=${this.fill} ?rtl=${rtl}>
                ${this.controls && this._isControllable() ? this.controls.map(
                    (ctrl) => html`
                    <mushroom-button
                        .icon=${ctrl.icon}
                        @click=${(e) => this._callService(ctrl, e)}
                    ></mushroom-button>
                `) : html`
                <mushroom-button
                    .icon=${ctrl_entity.icon}
                    @click=${(e) => this._callService(ctrl_entity, e)}
                ></mushroom-button>
                `}
            </mushroom-button-group>
        `;
    }
}
