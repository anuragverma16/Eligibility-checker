import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { saveApplication } from './api/applications';
import { ApplicationForm } from './components/ApplicationForm';
import { EligibilityResult } from './components/EligibilityResult';
import { HelpModal } from './components/HelpModal';
import { Hero } from './components/Hero';
import { Logo } from './components/Logo';
import { Navbar } from './components/Navbar';
import { SchemeGrid } from './components/SchemeGrid';
import { StepTracker } from './components/StepTracker';
import { TrackModal } from './components/TrackModal';
import { applicantFields } from './data/formFields';
import { initialValues, schemes, type FormValues, type Scheme, type SchemeId } from './data/schemes';
import { schemeDetails } from './data/schemeDetails';
import { downloadEligibilityCard } from './lib/downloadEligibilityCard';
import { computeReferenceId, computeStatus, getRequirement, today } from './lib/eligibility';
import { isFormComplete } from './lib/fieldValidation';

function App() {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState<SchemeId | null>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [showHelp, setShowHelp] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  const scheme = schemes.find((item) => item.id === selectedId) ?? schemes[0];
  const details = schemeDetails[scheme.id];

  const visibleSchemes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return schemes;
    return schemes.filter((item) =>
      [item.title, item.eyebrow, item.description, item.badge, item.amount].some((text) => text.toLowerCase().includes(term)),
    );
  }, [query]);

  const displayName = values.applicant || 'Your applicant name';
  const organization = values.organization || 'Your organization name';
  const requirement = getRequirement(scheme, values);
  const status = useMemo(() => computeStatus(scheme, values), [scheme, values]);
  const referenceId = useMemo(() => computeReferenceId(scheme, values, today), [scheme, values]);

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(selectedId);
    return isFormComplete(applicantFields, values) && isFormComplete(scheme.fields, values, details.limit);
  }, [step, selectedId, values, scheme, details]);

  // Scroll after the step has rendered, so the target section exists.
  useEffect(() => {
    if (!scrollTarget) return;
    const element = document.getElementById(scrollTarget);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setScrollTarget(null);
  }, [scrollTarget, step]);

  function goToSchemes() {
    setStep(1);
    setScrollTarget('schemes');
  }

  function selectScheme(item: Scheme) {
    setSelectedId(item.id);
    setSaveError('');
    setStep(2);
    setScrollTarget('top');
  }

  const updateValue = useCallback((key: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue || saving) return;

    setSaving(true);
    setSaveError('');
    try {
      await saveApplication({ schemeId: scheme.id, referenceId, status, values });
      setStep(3);
      setScrollTarget('top');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'We could not save your application. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setStep(1);
    setSelectedId(null);
    setValues(initialValues);
    setSaveError('');
    setQuery('');
    setScrollTarget('top');
  }

  function download() {
    downloadEligibilityCard({ scheme, values, status, referenceId, displayName, organization, requirement, today });
  }

  return (
    <div className="app">
      <Navbar onSchemes={goToSchemes} onHowItWorks={() => setShowHelp(true)} onTrack={() => setShowTrack(true)} />

      <main id="top" className="container">
        {step === 1 && (
          <div className="panel" key="step-1">
            <Hero schemeCount={schemes.length} onBrowse={goToSchemes} />
            <StepTracker step={step} />
            <SchemeGrid
              schemes={visibleSchemes}
              totalCount={schemes.length}
              query={query}
              selectedId={selectedId}
              onQueryChange={setQuery}
              onSelect={selectScheme}
            />
          </div>
        )}

        {step === 2 && (
          <div className="panel" key="step-2">
            <StepTracker step={step} />
            <ApplicationForm
              scheme={scheme}
              values={values}
              canContinue={canContinue}
              saving={saving}
              saveError={saveError}
              onChange={updateValue}
              onSubmit={submitForm}
              onBack={goToSchemes}
            />
          </div>
        )}

        {step === 3 && (
          <div className="panel" key="step-3">
            <StepTracker step={step} />
            <EligibilityResult
              scheme={scheme}
              values={values}
              status={status}
              referenceId={referenceId}
              today={today}
              displayName={displayName}
              organization={organization}
              requirement={requirement}
              onDownload={download}
              onBack={() => setStep(2)}
              onReset={reset}
              onChooseAnother={goToSchemes}
            />
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <Logo />
              <span className="brand-text">
                <strong>Grantwise</strong>
                <small>Funding eligibility portal</small>
              </span>
            </div>
            <p className="muted small">A clear, private way to check funding eligibility and keep a verifiable record of your application.</p>
          </div>
          <div>
            <h4>Portal</h4>
            <button onClick={goToSchemes}>Schemes</button>
            <button onClick={() => setShowHelp(true)}>How it works</button>
            <button onClick={() => setShowTrack(true)}>Track application</button>
          </div>
          <div>
            <h4>Important</h4>
            <p className="muted small">Eligibility cards are system-generated snapshots. They are not official documents and remain subject to verification by the scheme authority.</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Grantwise</span>
          <span>Applications are stored in the portal database</span>
        </div>
      </footer>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showTrack && <TrackModal onClose={() => setShowTrack(false)} />}
    </div>
  );
}

export default App;
