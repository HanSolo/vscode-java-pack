import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as React from "react";
import "../../assets/vscode.scss";
import { formatCode } from "./vscode.api";
import { HighlighterTest as Highlighter } from "./java.formatter.highlight";
import { JavaFormatterSettingPanel } from "../FormatterConstants";

interface CodePreviewPanelProps {
	code: string;
	panel: JavaFormatterSettingPanel;
}

interface CodePreviewPanelStates {
	value: string;
	highlightedCode: string;
	lastStepIsFormat: boolean;
}
export class CodePreviewPanel extends React.Component<CodePreviewPanelProps, CodePreviewPanelStates> {

	constructor(props: CodePreviewPanelProps) {
		super(props);
		this.state = {
			value: props.code,
			highlightedCode: props.code,
			lastStepIsFormat: false,
		};
		window.addEventListener("message", event => {
			if (event.data.command === "formattedCode") {
				const code = event.data.code;
				const panelType = event.data.panel;
				if (panelType === this.props.panel) {
					this.updateCode(code);
				}
			} else if (event.data.command === "formatCode" && event.data.panel === this.props.panel) {
				this.format();
			}
		});
		this.raw();
	}

	/*private handleChange = (event) => {
		this.setState({ value: event.target.value });
	}*/

	public format() {
		formatCode(this.state.value, this.props.panel, true);
		this.setState({ lastStepIsFormat: true });
	}

	private raw() {
		formatCode(this.state.value, this.props.panel, false);
		this.setState({ lastStepIsFormat: false });
	}

	public updateCode(code: string) {
		this.setState({ highlightedCode: code });
	}

	render() {
		return (
			<div id="root">
				<div style={{ height: "300px", overflow: "auto" }}>{Highlighter(this.state.highlightedCode)}</div>
				<div className="row">
					<div className="col-lg-12">
						<button onClick={() => this.format()} id="btnFormat" className="btn btn-primary mr-2 float-right" title="Format Code">Format Code</button>
						<button onClick={() => this.raw()} id="btnRaw" className="btn btn-primary mr-2 float-right" title="Edit Raw Code" disabled={!this.state.lastStepIsFormat}>See Raw Code</button>
					</div>
				</div>
			</div>
		);
	}
}
