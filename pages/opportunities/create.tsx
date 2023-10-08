import { FormEvent } from "react";

export default function () {
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/opportunities/create", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title")?.toString(),
        description: formData.get("description")?.toString(),
        location: formData.get("location")?.toString(),
        date: formData.get("date")?.toString(),
        imageUrl: formData.get("image")?.toString(),
      }),
    });

    if (response.ok) {
      alert("Opportunity created!");
      window.location.href = "/opportunities";
    } else {
      alert("Failed to create opportunity");
    }
  };

  return (
    <div className="w-50 m-auto">
      <h1>Create Opportunity</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="name-input" className="form-label">
            Event Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name-input"
            name="title"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description-input" className="form-label">
            Event Description
          </label>
          <textarea
            className="form-control"
            id="description-input"
            name="description"
          />
          <div className="form-text">
            Ideally you should include: What to expect, what to bring, how to
            get there, etc.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="location-input" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="location-input"
            name="location"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image-input" className="form-label">
            ImageUrl
          </label>
          <input
            type="text"
            className="form-control"
            id="image-input"
            name="image"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="date-input" className="form-label">
            Date
          </label>
          <input
            className="form-control"
            data-provide="datepicker"
            id="date-input"
            name="date"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
