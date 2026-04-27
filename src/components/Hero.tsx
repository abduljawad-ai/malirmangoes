import { ArrowRight } from "lucide-react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          Premium <span className="highlight">Pakistani</span> Mangoes
        </h1>
        <p className="hero-subtitle">
          Direct from the farms of Sindh & Multan. 10kg boxes delivered to your doorstep.
        </p>
        <div className="hero-cta">
          <a href="#products" className="btn btn-primary">
            Shop Now
            <ArrowRight className="btn-icon" />
          </a>
          <a href="#about" className="btn btn-secondary">
            Learn More
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">15+</span>
            <span className="stat-label">Years</span>
          </div>
          <div className="stat">
            <span className="stat-value">50K+</span>
            <span className="stat-label">Customers</span>
          </div>
          <div className="stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">Natural</span>
          </div>
        </div>
      </div>
    </section>
  );
}