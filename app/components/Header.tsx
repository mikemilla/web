import Image from 'next/image';

export function Header() {
  return (
    <header>
      <div className="keylines">
        <div className="titles">
          <h1>Mike Miller</h1>
          <h2>Design Engineer</h2>
          <p>
            I ship product—from pixels to production. Tastefully design products and engineer them to life. Any stack, any platform.
            <br />
            <br />
            Scroll down to see some work!
          </p>
          <a
            className="action-button"
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:mike@mikemiller.design"
            data-type="send-message"
          >
            Email Me
          </a>
        </div>
        <div className="image">
          <Image
            src="/assets/images/profile_1.png"
            alt="Mike Miller"
            width={590}
            height={600}
            priority
          />
        </div>
      </div>
    </header>
  );
}
