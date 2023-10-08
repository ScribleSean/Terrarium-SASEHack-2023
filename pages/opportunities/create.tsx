export default function () {
  return (
    <div className="w-50 m-auto">
      <h1>Create Opportunity</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="name-input" className="form-label">
            Event Name
          </label>
          <input type="text" className="form-control" id="name-input" />
        </div>
        <div className="mb-3">
          <label htmlFor="description-input" className="form-label">
            Event Description
          </label>
          <textarea className="form-control" id="description-input" />
          <div className="form-text">
            Ideally you should include: What to expect, what to bring, how to
            get there, etc.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="location-input" className="form-label">
            Location
          </label>
          <input type="text" className="form-control" id="location-input" />
        </div>
        <div className="mb-3">
          <label htmlFor="date-input" className="form-label">
            Date
          </label>
          <input
            className="form-control"
            data-provide="datepicker"
            id="date-input"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
