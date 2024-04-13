import PageNav from "../components/PageNav";

export default function Requirements() {
  return (
    <div className="flex flex-col space-y-2">
      <p>Add functionality to add list of requirements</p>
      <PageNav
        backTo="/setup-page"
        nextTo="/upload-photos"
        nextText="(Upload Photos)"
      />
    </div>
  );
}
