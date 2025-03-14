interface ReviewFieldValueProps {
  label: string;
  value: string;
  possibleValues: string[];
}

const ReviewFieldValue = ({
  label,
  value,
  possibleValues,
}: ReviewFieldValueProps) => {
  const index = possibleValues.findIndex((val) => val === value) + 1;

  return (
    <>
      <span>{label}</span>

      <span className="text-foreground/50 text-[75%]">
        <span>(</span>

        <span>{index}</span>

        <span>/</span>

        <span>{possibleValues.length}</span>

        <span>)</span>
      </span>
    </>
  );
};

export default ReviewFieldValue;
