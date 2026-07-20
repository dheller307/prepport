package com.prepport.controller;

import java.util.List;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import com.prepport.repository.PrepSessionRepository;
import com.prepport.repository.BatchRepository;
import com.prepport.entity.PrepSession;
import com.prepport.entity.Batch;

@RestController
@RequestMapping("/api/prep-sessions")
public class PrepSessionController {

    private final PrepSessionRepository repository;
    private final BatchRepository batchRepository;
    public PrepSessionController(PrepSessionRepository repository, BatchRepository batchRepository) {
        this.repository = repository;
        this.batchRepository = batchRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PrepSession createPrepSession(@RequestBody PrepSession prepSession) {
        return repository.save(prepSession);
    }

    @PostMapping("/{id}/batches")
    @ResponseStatus(HttpStatus.CREATED)
    public Batch createBatch(@PathVariable Long id, @RequestBody Batch batch) {
        PrepSession prepSession = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
        batch.setPrepSession(prepSession);
        return batchRepository.save(batch);
    }

    @GetMapping
    public List<PrepSession> listPrepSessions() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public PrepSession getPrepSession(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
    }

    @PutMapping("/{id}")
    public PrepSession updatePrepSession(@PathVariable Long id, @RequestBody PrepSession prepSession) {
        PrepSession prepSessionToUpdate = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
        prepSessionToUpdate.setSessionDate(prepSession.getSessionDate());
        prepSessionToUpdate.setNotes(prepSession.getNotes());
        return repository.save(prepSessionToUpdate);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePrepSession(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found");
        }
        repository.deleteById(id);
    }
}

    