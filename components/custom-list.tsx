import style from "styles/components/custom-list.module.css";

interface CustomListProps {
	name: string;
	options: string[];
	optionLabels?: string[];
	selectedOption: string;
	handleChange: (value: string) => void;
}

const CustomList = ({ name, options, optionLabels, selectedOption, handleChange }: CustomListProps) => {
	return (
		<div className={style.list}>
			{options.map((e, index) => {
				const inputId = `radio-${name}-${index}`;
				const label = optionLabels ? optionLabels[index] : e;
				return (
					<div key={inputId}>
						<input type="radio" name={name} id={inputId} checked={selectedOption === e} onChange={() => handleChange(e)}/>
						<label htmlFor={inputId}>{label}</label>
					</div>
				);
			})}
		</div>
	);
};

export default CustomList;
