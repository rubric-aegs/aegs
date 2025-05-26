import { scaleScore } from '../../utils/scoreUtils';
import  '../../assets/css/GradingResults.css';


const CriteriaScoreTable = ({ criteriaScores, weights, scoreScale, onImageClick }) => {
  const getGraphExplanation = (criterion, score) => {
    const scaledScore = scaleScore(score, scoreScale);
    const formattedCriterion = criterion.replace(/_/g, ' ').toLowerCase();
    
    if (score >= 0.90) {
      return `With a score of ${scaledScore}, ${formattedCriterion} falls primarily in the "Excellent" category. On the graph, this score has very high membership in the "Excellent" trapezoid, indicating outstanding performance that exceeds expectations in this area.`;
    } else if (score >= 0.75) {
      return `With a score of ${scaledScore}, ${formattedCriterion} falls primarily in the "Very Good" category with some overlap into "Excellent". On the graph, this score shows strong membership in the "Very Good" trapezoid, indicating above average performance in this area.`;
    } else if (score >= 0.60) {
      return `With a score of ${scaledScore}, ${formattedCriterion} falls primarily in the "Good" category. On the graph, this score shows significant membership in the "Good" trapezoid, indicating satisfactory performance that meets standard expectations.`;
    } else if (score >= 0.45) {
      return `With a score of ${scaledScore}, ${formattedCriterion} falls primarily in the "Fair" category. On the graph, this score shows significant membership in the "Fair" trapezoid, indicating performance that needs improvement in this area.`;
    } else {
      return `With a score of ${scaledScore}, ${formattedCriterion} falls primarily in the "Poor" category. On the graph, this score shows high membership in the "Poor" trapezoid, indicating performance that is below expectations and requires significant improvement.`;
    }
  };

  return (
    <div className="criteria-scores">
      <h3>Criteria Scores:</h3>
      <table>
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Score</th>
            <th>Weight</th>
            <th>Score Graphs</th>
            <th>Explanation</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(criteriaScores)
            .filter(([criterion]) => {
              if (weights && typeof weights === 'object') {
                return weights[criterion] > 0;
              }
              return true;
            })
            .map(([criterion, score]) => (
              <tr key={criterion}>
                <td>{criterion.replace(/_/g, ' ').toUpperCase()}</td>
                <td>{scaleScore(score, scoreScale)}</td>
                <td>{weights[criterion]}%</td>
                <td>
                  <img
                    src={`/api/fuzzy-graph/${criterion}`}
                    alt={`${criterion} fuzzy graph`}
                    className="fuzzy-graph-thumbnail"
                    onClick={() => onImageClick(criterion)}
                  />
                </td>
                <td className="explanation-cell">
                  <div className="explanation-wrapper">
                    {getGraphExplanation(criterion, score)}
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default CriteriaScoreTable;