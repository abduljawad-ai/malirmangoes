import "./About.css";

interface AboutProps {
  title?: string;
  text?: string;
}

export default function About({ title = "Why Choose Us?", text = "Direct from farmers in Sindh & Multan to your doorstep" }: AboutProps) {
  return (
    <section className="about" id="about">
      <div className="about-content">
        <h2 className="about-title">{title}</h2>
        <p className="about-subtitle">{text}</p>
        <div className="about-stats">
          <div className="about-stat">
            <span className="stat-number">15+</span>
            <span className="stat-text">Years Experience</span>
          </div>
          <div className="about-stat">
            <span className="stat-number">50K+</span>
            <span className="stat-text">Happy Customers</span>
          </div>
          <div className="about-stat">
            <span className="stat-number">100%</span>
            <span className="stat-text">Satisfaction</span>
          </div>
        </div>
        <div className="about-features">
          <div className="feature">
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Free Delivery</h3>
            <p className="feature-text">On orders above Rs. 3000</p>
          </div>
          <div className="feature">
            <div className="feature-icon">✅</div>
            <h3 className="feature-title">Quality Assured</h3>
            <p className="feature-text">Hand-picked fresh mangoes</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌿</div>
            <h3 className="feature-title">100% Natural</h3>
            <p className="feature-text">No chemicals or preservatives</p>
          </div>
        </div>
      </div>
    </section>
  );
}