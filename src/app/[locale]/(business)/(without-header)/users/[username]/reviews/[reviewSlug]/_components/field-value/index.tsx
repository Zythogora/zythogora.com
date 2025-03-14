interface ReviewFieldValueProps {
  value: string;
  possibleValues: string[];
}

const ReviewFieldValue = ({ value, possibleValues }: ReviewFieldValueProps) => {
  const index = possibleValues.findIndex((value) => value === value) + 1;

  return (
    <>
      <span>{value}</span>

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
