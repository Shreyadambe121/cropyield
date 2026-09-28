export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Methodology</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">AI pipeline for yield prediction</h1>
        </div>

        <div className="card p-6">
          <div className="space-y-3">
            <p><strong>1. Data Collection:</strong> Agricultural records were gathered from district and seasonal crop datasets including crop, rainfall, temperature, area, and production.</p>
            <p><strong>2. Data Cleaning:</strong> Missing values, invalid entries, and inconsistent district names were normalized before training.</p>
            <p><strong>3. Exploratory Data Analysis:</strong> Yield patterns across states, districts, and seasons were inspected to understand field behavior.</p>
            <p><strong>4. Feature Selection:</strong> Relevant variables such as crop, district, rainfall, temperature, area, and season were selected for the model.</p>
            <p><strong>5. Random Forest:</strong> Random Forest was chosen because it handles non-linear relationships well and supports both regression and classification.</p>
            <p><strong>6. Model Training:</strong> Separate pipelines were trained for yield prediction and crop suitability classification.</p>
            <p><strong>7. Prediction:</strong> New input features are transformed and passed through the trained model to estimate yield or suitability.</p>
            <p><strong>8. Evaluation:</strong> Metrics such as MAE, RMSE, R² score, and classification accuracy are generated from the test set.</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Model workflow</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="rounded-xl bg-slate-100 p-3">Agricultural Data</div>
            <div className="text-center">↓</div>
            <div className="rounded-xl bg-slate-100 p-3">Data Cleaning</div>
            <div className="text-center">↓</div>
            <div className="rounded-xl bg-slate-100 p-3">Feature Selection</div>
            <div className="text-center">↓</div>
            <div className="rounded-xl bg-slate-100 p-3">Random Forest Model</div>
            <div className="text-center">↓</div>
            <div className="rounded-xl bg-slate-100 p-3">Yield Prediction</div>
            <div className="text-center">↓</div>
            <div className="rounded-xl bg-slate-100 p-3">Crop Recommendation</div>
          </div>
        </div>
      </div>
    </div>
  );
}
